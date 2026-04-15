import { type FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  isAdminDemoMode,
  isAdminLoggedIn,
  setAdminDemoMode,
  setAdminLoggedIn,
} from '../../lib/adminAuth'
import { apiPost, getApiBaseUrl, getStoredToken, setStoredToken } from '../../lib/api'
import './admin-login.css'

/** Hardcoded admin gate (matches backend seed defaults when API is used). */
export const ADMIN_EMAIL = 'admin@callmatrix.ai'
export const ADMIN_PASSWORD = 'admin123'

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState(ADMIN_PASSWORD)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAdminLoggedIn() && (getStoredToken() || isAdminDemoMode())) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (email.trim() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError('Invalid email or password.')
      return
    }

    setSubmitting(true)
    try {
      setAdminLoggedIn(true)

      const base = getApiBaseUrl()
      if (base) {
        try {
          const res = await apiPost<{ token?: string }>('/auth/login', {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
          })
          if (res?.token) {
            setStoredToken(res.token)
            setAdminDemoMode(false)
            navigate('/admin/dashboard', { replace: true })
            return
          }
        } catch {
          /* API unavailable or invalid — use offline demo session */
        }
      }

      setAdminDemoMode(true)
      navigate('/admin/dashboard', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="adminLoginRoot">
      <div className="adminLoginCard">
        <h1 className="adminLoginTitle">Admin sign in</h1>
        <p className="adminLoginSub">Call Matrix control center</p>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          Demo: fields are pre-filled. Credentials:{' '}
          <strong>{ADMIN_EMAIL}</strong> / <strong>{ADMIN_PASSWORD}</strong>
        </p>
        <form className="adminLoginForm" onSubmit={handleSubmit} noValidate>
          <label className="adminLoginLabel" htmlFor="admin-email">
            Email
          </label>
          <input
            id="admin-email"
            className="input-field"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="adminLoginLabel" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            className="input-field"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="adminLoginError" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary adminLoginSubmit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
