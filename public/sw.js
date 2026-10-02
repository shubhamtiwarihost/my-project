/* Minimal service worker so the site can install like an app */
const CACHE = 'shubham-portfolio-v2'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/', '/manifest.webmanifest', '/icon-192.png']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  // API calls, tracked CV downloads and the admin panel always go to the server
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return

  const fromNetwork = fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone()
      caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {})
    }
    return response
  })

  if (request.mode === 'navigate') {
    // Pages: newest version first, cached copy only when offline
    event.respondWith(fromNetwork.catch(() => caches.match(request).then((cached) => cached || caches.match('/'))))
    return
  }

  // Hashed assets: cache first
  event.respondWith(
    caches.match(request).then((cached) => cached || fromNetwork)
  )
})
