import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as fallback from '../data/content'
import { fetchContent, sessionId, trackVisit } from '../lib/api'

const ContentContext = createContext(null)

function isEmpty(value) {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

function mergeContent(apiData, defaults) {
  if (!apiData || apiData.ok === false) return defaults

  const profile = {
    ...defaults.profile,
    ...(apiData.profile || {}),
    stats: !isEmpty(apiData.profile?.stats) ? apiData.profile.stats : defaults.profile.stats,
    // Keep local CV download if CMS has no published resume PDF
    resumeUrl: !isEmpty(apiData.profile?.resumeUrl)
      ? apiData.profile.resumeUrl
      : defaults.profile.resumeUrl,
    resumeFileName: !isEmpty(apiData.profile?.resumeFileName)
      ? apiData.profile.resumeFileName
      : defaults.profile.resumeFileName,
  }

  return {
    profile,
    navLinks: !isEmpty(apiData.navLinks) ? apiData.navLinks : defaults.navLinks,
    about: {
      ...defaults.about,
      ...(apiData.about || {}),
      leadershipBody: !isEmpty(apiData.about?.leadershipBody)
        ? apiData.about.leadershipBody
        : defaults.about.leadershipBody,
      bringItems: !isEmpty(apiData.about?.bringItems)
        ? apiData.about.bringItems
        : defaults.about.bringItems,
      highlights: !isEmpty(apiData.about?.highlights)
        ? apiData.about.highlights
        : defaults.about.highlights,
    },
    skillGroups: !isEmpty(apiData.skillGroups) ? apiData.skillGroups : defaults.skillGroups,
    alsoUsed: !isEmpty(apiData.alsoUsed) ? apiData.alsoUsed : defaults.alsoUsed,
    experiences: !isEmpty(apiData.experiences) ? apiData.experiences : defaults.experiences,
    education: !isEmpty(apiData.education) ? apiData.education : defaults.education,
    projects: !isEmpty(apiData.projects) ? apiData.projects : defaults.projects,
    projectsNote: !isEmpty(apiData.projectsNote) ? apiData.projectsNote : defaults.projectsNote,
    skillsCopy: {
      title: apiData.skillsCopy?.title || defaults.skillsCopy.title,
      subtitle: apiData.skillsCopy?.subtitle || defaults.skillsCopy.subtitle,
    },
    experienceCopy: {
      title: apiData.experienceCopy?.title || defaults.experienceCopy.title,
      subtitle: apiData.experienceCopy?.subtitle || defaults.experienceCopy.subtitle,
    },
    projectsCopy: {
      title: apiData.projectsCopy?.title || defaults.projectsCopy.title,
      subtitle: apiData.projectsCopy?.subtitle || defaults.projectsCopy.subtitle,
    },
    contactCopy: { ...defaults.contactCopy, ...(apiData.contactCopy || {}) },
    footer: {
      tagline: apiData.footer?.tagline || defaults.footer.tagline,
      copyrightName: apiData.footer?.copyrightName || profile.shortName,
    },
    navbar: {
      ctaLabel: apiData.navbar?.ctaLabel || "Let's Talk",
    },
    hero: {
      backgroundUrl: apiData.hero?.backgroundUrl || null,
      ctas: Array.isArray(apiData.hero?.ctas) ? apiData.hero.ctas : [],
    },
    socialLinks: Array.isArray(apiData.socialLinks) ? apiData.socialLinks : [],
    seo: apiData.seo || {},
    settings: apiData.settings || {},
    fromApi: true,
  }
}

const defaultBundle = {
  profile: fallback.profile,
  navLinks: fallback.navLinks,
  about: fallback.about,
  skillGroups: fallback.skillGroups,
  alsoUsed: fallback.alsoUsed,
  experiences: fallback.experiences,
  education: fallback.education,
  projects: fallback.projects,
  projectsNote: fallback.projectsNote,
  contactCopy: fallback.contactCopy,
  skillsCopy: {
    title: 'Technical skills for production backends.',
    subtitle:
      'Languages, frameworks, APIs, data stores, and cloud practices used to ship high-availability systems.',
  },
  experienceCopy: {
    title: 'Professional experience',
    subtitle: 'Backend systems and distributed architecture across edtech, Fortune 500 CMS, and enterprise platforms.',
  },
  projectsCopy: {
    title: 'Key projects & systems architecture',
    subtitle:
      'Assessment engines, enterprise CMS, and GraphQL integration platforms — built for throughput, uptime, and scale.',
  },
  footer: {
    tagline: 'Senior Software Engineer · Backend Systems & Distributed Architecture',
    copyrightName: fallback.profile.shortName,
  },
  navbar: { ctaLabel: "Let's Talk" },
  hero: { backgroundUrl: null, ctas: [] },
  socialLinks: [],
  seo: {},
  settings: {},
  fromApi: false,
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultBundle)
  const [status, setStatus] = useState('loading') // loading | ready | fallback

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const data = await fetchContent()
        if (cancelled) return
        const merged = mergeContent(data, defaultBundle)
        setContent(merged)
        setStatus('ready')

        // Apply SEO from CMS when available
        if (merged.seo?.metaTitle) document.title = merged.seo.metaTitle
        const desc = document.querySelector('meta[name="description"]')
        if (desc && merged.seo?.metaDescription) {
          desc.setAttribute('content', merged.seo.metaDescription)
        }
        if (merged.settings?.primary_color) {
          document.documentElement.style.setProperty('--accent', merged.settings.primary_color)
        }
        if (merged.settings?.theme_color) {
          const theme = document.querySelector('meta[name="theme-color"]')
          if (theme) theme.setAttribute('content', merged.settings.theme_color)
        }
      } catch {
        if (cancelled) return
        setContent(defaultBundle)
        setStatus('fallback')
      }

      trackVisit({
        landing_page: window.location.pathname + window.location.search + window.location.hash,
        referrer: document.referrer || '',
        session_id: sessionId(),
      })
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => ({ ...content, status }), [content, status])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return ctx
}
