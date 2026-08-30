import { useEffect, useMemo, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { IconMail, IconMonitor } from './Icons'

const TAB_HREFS = ['#home', '#about', '#projects', '#contact']

function getInstallBannerDefaults() {
  if (typeof window === 'undefined') {
    return { standalone: true, visible: false, iosHint: false }
  }
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  if (standalone) {
    return { standalone: true, visible: false, iosHint: false }
  }
  const dismissed = sessionStorage.getItem('install-banner-dismissed') === '1'
  if (dismissed) {
    return { standalone: false, visible: false, iosHint: false }
  }
  const ua = window.navigator.userAgent || ''
  const isIos = /iPhone|iPad|iPod/i.test(ua)
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua)
  const narrow = window.matchMedia('(max-width: 900px)').matches
  if (isIos && isSafari) {
    return { standalone: false, visible: true, iosHint: true }
  }
  if (!isIos && narrow) {
    return { standalone: false, visible: true, iosHint: false }
  }
  return { standalone: false, visible: false, iosHint: false }
}

function TabIcon({ href, active }) {
  const stroke = active ? 'currentColor' : 'currentColor'
  const id = href.replace('#', '')
  if (id === 'home') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z" />
      </svg>
    )
  }
  if (id === 'about') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
      </svg>
    )
  }
  if (id === 'projects') return <IconMonitor size={22} />
  if (id === 'contact') return <IconMail size={22} />
  return null
}

export default function MobileAppBar({ active }) {
  const { navLinks } = useContent()

  const tabs = useMemo(() => {
    const fromCms = navLinks.filter((l) => TAB_HREFS.includes(l.href))
    if (fromCms.length >= 3) return fromCms
    return [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ]
  }, [navLinks])

  return (
    <nav className="mobile-appbar" aria-label="App navigation">
      {tabs.map((tab) => {
        const id = tab.href.slice(1)
        const isActive = active === id || (id === 'about' && (active === 'skills' || active === 'experience'))
        return (
          <a
            key={tab.href}
            href={tab.href}
            className={`mobile-appbar__item${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="mobile-appbar__icon"><TabIcon href={tab.href} active={isActive} /></span>
            <span className="mobile-appbar__label">{tab.label}</span>
          </a>
        )
      })}
    </nav>
  )
}

export function InstallAppBanner() {
  const defaults = useMemo(() => getInstallBannerDefaults(), [])
  const [visible, setVisible] = useState(defaults.visible)
  const [deferred, setDeferred] = useState(null)
  const [iosHint, setIosHint] = useState(defaults.iosHint)
  const standalone = defaults.standalone

  useEffect(() => {
    if (standalone) return undefined

    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
      if (sessionStorage.getItem('install-banner-dismissed') !== '1') {
        setVisible(true)
      }
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [standalone])

  if (standalone || !visible) return null

  const dismiss = () => {
    sessionStorage.setItem('install-banner-dismissed', '1')
    setVisible(false)
  }

  const install = async () => {
    if (deferred) {
      deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
      dismiss()
      return
    }
    setIosHint(true)
  }

  return (
    <div className="install-banner" role="dialog" aria-label="Install app">
      <div className="install-banner__text">
        <strong>Open like an app</strong>
        <span>
          {iosHint
            ? 'Safari → Share → Add to Home Screen'
            : 'Install to hide the browser bar and use full screen'}
        </span>
      </div>
      <div className="install-banner__actions">
        {!iosHint || deferred ? (
          <button type="button" className="btn btn-primary install-banner__btn" onClick={install}>
            Install
          </button>
        ) : null}
        <button type="button" className="install-banner__close" onClick={dismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}
