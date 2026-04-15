import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'

type AnalyticsResponse = {
  callsPerDay: { date: string; count: number }[]
  callsPerUser: {
    userId: string
    email: string
    callCount: number
    totalDuration: number
  }[]
  agentsCreatedInRange: number
  campaignPerformance: { name: string; callCount: number; status: string }[]
  totalCalls: number
  totalDuration: number
}

function defaultRange(): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

function buildQuery(from: string, to: string): string {
  const qs = new URLSearchParams()
  if (from.trim()) qs.set('from', new Date(from + 'T00:00:00.000Z').toISOString())
  if (to.trim()) qs.set('to', new Date(to + 'T23:59:59.999Z').toISOString())
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export function AdminAnalytics() {
  const defaults = useMemo(() => defaultRange(), [])
  const [from, setFrom] = useState(defaults.from)
  const [to, setTo] = useState(defaults.to)
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const q = buildQuery(from, to)
      const res = await apiGet<AnalyticsResponse>(`/admin/analytics${q}`)
      setData(res)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [from, to])

  useEffect(() => {
    void load()
  }, [load])

  if (!getStoredToken()) {
    return (
      <p className="adminTokenHint">
        No JWT — sign in from <a href="/admin/login">/admin/login</a>.
      </p>
    )
  }

  return (
    <>
      <p className="adminPageSub">GET /admin/analytics — date range filters call activity</p>

      <div className="adminToolbar" style={{ marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="adminSearchWrap" style={{ maxWidth: 160 }}>
          <label className="adminPageSub" htmlFor="an-from" style={{ display: 'block', marginBottom: 4 }}>
            From
          </label>
          <input
            id="an-from"
            className="input-field"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="adminSearchWrap" style={{ maxWidth: 160 }}>
          <label className="adminPageSub" htmlFor="an-to" style={{ display: 'block', marginBottom: 4 }}>
            To
          </label>
          <input
            id="an-to"
            className="input-field"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <button type="button" className="btn-primary" onClick={() => void load()}>
          Refresh
        </button>
      </div>

      {loading && <p className="adminPageSub">Loading…</p>}
      {error && (
        <p className="adminTokenHint" role="alert">
          {error}
        </p>
      )}

      {data && !loading && (
        <>
          <div className="adminUsageSummary" style={{ marginBottom: 24 }}>
            <div className="adminUsageCard">
              <p className="adminUsageLabel">Total calls (range)</p>
              <p className="adminUsageValue">{data.totalCalls.toLocaleString()}</p>
            </div>
            <div className="adminUsageCard">
              <p className="adminUsageLabel">Talk time (range)</p>
              <p className="adminUsageValue">
                {Math.round(data.totalDuration / 60)}h ({data.totalDuration.toLocaleString()} min)
              </p>
            </div>
            <div className="adminUsageCard">
              <p className="adminUsageLabel">Agents created (range)</p>
              <p className="adminUsageValue">{data.agentsCreatedInRange.toLocaleString()}</p>
            </div>
          </div>

          <section className="adminSection">
            <h2 className="adminSectionTitle">Calls per day</h2>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Calls</th>
                  </tr>
                </thead>
                <tbody>
                  {data.callsPerDay.map((row) => (
                    <tr key={row.date}>
                      <td>{row.date}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.callsPerDay.length === 0 && <p className="adminEmpty">No calls in range.</p>}
            </div>
          </section>

          <section className="adminSection">
            <h2 className="adminSectionTitle">Calls per tenant</h2>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Calls</th>
                    <th scope="col">Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.callsPerUser.map((row) => (
                    <tr key={row.userId}>
                      <td>{row.email}</td>
                      <td>{row.callCount}</td>
                      <td>{Math.round(row.totalDuration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.callsPerUser.length === 0 && <p className="adminEmpty">No data.</p>}
            </div>
          </section>

          <section className="adminSection">
            <h2 className="adminSectionTitle">Campaign performance</h2>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th scope="col">Campaign</th>
                    <th scope="col">Status</th>
                    <th scope="col">Calls</th>
                  </tr>
                </thead>
                <tbody>
                  {data.campaignPerformance.map((row, i) => (
                    <tr key={`${row.name}-${i}`}>
                      <td>{row.name}</td>
                      <td>{row.status}</td>
                      <td>{row.callCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.campaignPerformance.length === 0 && <p className="adminEmpty">No data.</p>}
            </div>
          </section>
        </>
      )}
    </>
  )
}
