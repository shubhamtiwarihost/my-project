import { lazy, Suspense, useEffect } from 'react'
import './App.css'
import './premium.css'
import { ContentProvider, useContent } from './context/ContentProvider'
import AmbientMusic from './components/AmbientMusic'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { CursorGlow, ScrollProgress } from './components/PremiumFx'
import Preloader from './components/Preloader'
import { useIsCompactDevice } from './hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { initGA } from './lib/analytics'

const WorldScene = lazy(() => import('./components/WorldScene'))

function PortfolioShell() {
  const { status, settings, profile } = useContent()
  const reducedMotion = usePrefersReducedMotion()
  const compact = useIsCompactDevice()

  useEffect(() => {
    initGA()
  }, [])

  if (settings?.maintenance_mode) {
    return (
      <div className="app-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>We’ll be right back</h1>
          <p style={{ color: 'var(--ink-muted)' }}>The site is temporarily under maintenance. Please check again soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell" data-content-status={status}>
      {!reducedMotion && (
        <Suspense fallback={null}>
          <WorldScene lite={compact} />
        </Suspense>
      )}
      {!reducedMotion && <Preloader initials={profile.initials} />}
      <ScrollProgress />
      {!compact && !reducedMotion && <CursorGlow />}
      <Navbar />
      <AmbientMusic />
      <main>
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ContentProvider>
      <PortfolioShell />
    </ContentProvider>
  )
}

export default App
