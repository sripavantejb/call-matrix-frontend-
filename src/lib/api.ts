const TOKEN_KEY = 'callmatrix_token'

const DEV_DEFAULT_API = 'http://localhost:3000'

/**
 * API origin (no trailing slash).
 * In development, if `VITE_API_URL` is unset, defaults to `http://localhost:3000` so `npm run dev` works without copying `.env`.
 * In production builds, set `VITE_API_URL` explicitly.
 */
export function getApiBaseUrl(): string {
  const u = import.meta.env.VITE_API_URL as string | undefined
  const trimmed = (u ?? '').trim().replace(/\/$/, '')
  if (trimmed) return trimmed
  if (import.meta.env.DEV) return DEV_DEFAULT_API
  return ''
}

function baseUrl(): string {
  return getApiBaseUrl()
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

type FetchOpts = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiFetch<T>(
  path: string,
  options: FetchOpts = {},
): Promise<T> {
  const url = `${baseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  const token = getStoredToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body:
      options.body !== undefined && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : (options.body as BodyInit | undefined),
  })

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!res.ok) {
    let msg = text
    try {
      const j = JSON.parse(text) as { message?: string }
      if (j.message) msg = j.message
    } catch {
      /* ignore */
    }
    throw new Error(msg || `HTTP ${res.status}`)
  }

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'GET' })
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body })
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body })
}

export async function apiDelete(path: string): Promise<void> {
  await apiFetch(path, { method: 'DELETE' })
}

/** Public health check — no auth required (still uses same API base URL). */
export async function fetchHealth(): Promise<{
  status: string
  database: boolean
  redis: boolean
}> {
  const url = `${baseUrl()}/health`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`)
  }
  return JSON.parse(text) as {
    status: string
    database: boolean
    redis: boolean
  }
}
