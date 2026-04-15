import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Building2, Phone, Users } from 'lucide-react'
import { MetricCard } from '../../components/dashboard/MetricCard'
import '../../components/dashboard/dashboard.css'
import { apiGet, fetchHealth, getApiBaseUrl, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'

type DashboardResponse = {
  totalUsers: number
  activeUsers: number
  totalCalls: number
  callsLast30Days: number
  totalCampaigns: number
  totalAgents: number
  systemUsageMinutes: number
  talkTimeLast30DaysMinutes: number
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [health, setHealth] = useState<{ database: boolean; redis: boolean } | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadHealth() {
      if (!getApiBaseUrl()) {
        if (!cancelled) setHealthError('VITE_API_URL not set (required in production)')
        return
      }
      try {
        const h = await fetchHealth()
        if (!cancelled) {
          setHealth({ database: h.database, redis: h.redis })
          setHealthError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setHealth(null)
          setHealthError(e instanceof Error ? e.message : 'Health check failed')
        }
      }
    }
    void loadHealth()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!getStoredToken()) {
        if (!cancelled) {
          setLoading(false)
          setError(null)
          setData(null)
        }
        return
      }
      try {
        const d = await apiGet<DashboardResponse>('/admin/dashboard')
        if (!cancelled) {
          setData(d)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load dashboard')
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const hasToken = Boolean(getStoredToken())

  return (
    <div className="adminPanel">
      {!hasToken && (
        <p className="adminTokenHint">
          No API token in this browser. Sign out and sign in again from{' '}
          <Link to="/admin/login">/admin/login</Link> so <code className="adminCode">POST /auth/login</code>{' '}
          can store a JWT (requires seeded admin user and <code className="adminCode">VITE_API_URL</code>).
        </p>
      )}

      <section className="adminSection">
        <h2 className="adminSectionTitle">Platform overview</h2>
        {loading && hasToken && <p className="adminPageSub">Loading metrics…</p>}
        {error && hasToken && (
          <p className="adminTokenHint" role="alert">
            {error}
          </p>
        )}
        <div className="adminMetrics">
          {hasToken && !loading && !error && data ? (
            <>
              <MetricCard
                title="Total tenants"
                value={String(data.totalUsers)}
                sub="Registered users"
                icon={Building2}
              />
              <MetricCard
                title="Active accounts"
                value={String(data.activeUsers)}
                sub="status = active"
                icon={Users}
              />
              <MetricCard
                title="Calls last 30 days"
                value={data.callsLast30Days.toLocaleString()}
                sub={`${data.totalCalls.toLocaleString()} all-time total`}
                icon={Phone}
              />
              <MetricCard
                title="Total talk time"
                value={`${Math.round(data.systemUsageMinutes / 60)}h`}
                sub={`${data.systemUsageMinutes.toLocaleString()} min all-time · ${Math.round(data.talkTimeLast30DaysMinutes / 60)}h last 30d`}
                icon={Activity}
              />
            </>
          ) : (
            <>
              <MetricCard
                title="Total tenants"
                value={loading && hasToken ? '…' : '—'}
                sub={hasToken ? 'Awaiting data' : 'Sign in for live counts'}
                icon={Building2}
              />
              <MetricCard
                title="Active accounts"
                value={loading && hasToken ? '…' : '—'}
                sub={hasToken ? 'Awaiting data' : 'Sign in for live counts'}
                icon={Users}
              />
              <MetricCard
                title="Calls last 30 days"
                value={loading && hasToken ? '…' : '—'}
                sub={hasToken ? 'Awaiting data' : 'Sign in for live counts'}
                icon={Phone}
              />
              <MetricCard
                title="Total talk time"
                value={loading && hasToken ? '…' : '—'}
                sub={hasToken ? 'Awaiting data' : 'Sign in for live counts'}
                icon={Activity}
              />
            </>
          )}
        </div>
      </section>

      <section className="adminSection">
        <h2 className="adminSectionTitle">SaaS customers</h2>
        <div className="adminUsageCard" style={{ maxWidth: 640 }}>
          <p className="adminUsageLabel">Tenant directory</p>
          <p className="adminUsageHint">
            Create and manage customer accounts, plans, and status from one place.
          </p>
          <Link to="/admin/customers" className="adminGhostBtn" style={{ display: 'inline-flex' }}>
            Open customers
          </Link>
        </div>
      </section>

      <section className="adminSection">
        <h2 className="adminSectionTitle">Usage analytics</h2>
        <div className="adminUsageSummary">
          <div className="adminUsageCard">
            <p className="adminUsageLabel">Campaigns</p>
            <p className="adminUsageValue">
              {data?.totalCampaigns != null ? data.totalCampaigns.toLocaleString() : '—'}
            </p>
          </div>
          <div className="adminUsageCard">
            <p className="adminUsageLabel">AI agents</p>
            <p className="adminUsageValue">
              {data?.totalAgents != null ? data.totalAgents.toLocaleString() : '—'}
            </p>
          </div>
        </div>
        <p className="adminUsageHint">
          Detailed charts and date filters live under{' '}
          <Link to="/admin/analytics">Analytics</Link>.
        </p>
      </section>

      <section className="adminSection">
        <h2 className="adminSectionTitle">System health</h2>
        <div className="adminUsageSummary">
          <div className="adminUsageCard">
            <p className="adminUsageLabel">Database</p>
            <p className="adminUsageValue" style={{ fontSize: 18 }}>
              {health?.database === true ? 'OK' : health?.database === false ? 'Down' : '—'}
            </p>
            <p className="adminUsageHint" style={{ marginBottom: 0 }}>
              From <code className="adminCode">GET /health</code>
              {healthError && ` · ${healthError}`}
            </p>
          </div>
          <div className="adminUsageCard">
            <p className="adminUsageLabel">Redis</p>
            <p className="adminUsageValue" style={{ fontSize: 18 }}>
              {health?.redis === true ? 'OK' : health?.redis === false ? 'Down' : '—'}
            </p>
            <p className="adminUsageHint" style={{ marginBottom: 0 }}>
              Rate limiting / queues
            </p>
          </div>
          <div className="adminUsageCard">
            <p className="adminUsageLabel">Admin API</p>
            <p className="adminUsageValue" style={{ fontSize: 18 }}>
              {hasToken && !error ? 'OK' : 'Check token'}
            </p>
            <p className="adminUsageHint" style={{ marginBottom: 0 }}>
              JWT with role admin
            </p>
          </div>
          <div className="adminUsageCard">
            <p className="adminUsageLabel">Logs</p>
            <p className="adminUsageValue" style={{ fontSize: 18 }}>
              <Link to="/admin/logs">View logs</Link>
            </p>
            <p className="adminUsageHint" style={{ marginBottom: 0 }}>
              Audit trail and platform events.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
