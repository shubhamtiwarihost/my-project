/**
 * API client for Portfolio CMS public endpoints.
 * Set VITE_API_BASE in .env (e.g. https://gyaando.com/api)
 */

const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data
}

export function getApiBase() {
  return API_BASE
}

export async function fetchContent() {
  return request('/content.php')
}

export async function trackVisit(payload) {
  try {
    await request('/visit.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch {
    // analytics should never break the UI
  }
}

export async function trackResumeDownload(mediaId) {
  try {
    await request('/download.php', {
      method: 'POST',
      body: JSON.stringify({ media_id: mediaId ?? null }),
    })
  } catch {
    // ignore
  }
}

export async function submitContact(form) {
  return request('/contact.php', {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export function sessionId() {
  const key = 'portfolio_sid'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(16).slice(2)}`
    localStorage.setItem(key, id)
  }
  return id
}
