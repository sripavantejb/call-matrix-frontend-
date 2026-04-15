import { useCallback, useEffect, useState } from 'react'
import { apiGet, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'

type LogItem = {
  id: string
  type: string
  message: string
  metadata: unknown
  userId: string | null
  createdAt: string
  user: { id: string; email: string; name: string } | null
}

type LogsResponse = {
  page: number
  limit: number
  items: LogItem[]
}

const LOG_TYPES = ['', 'login', 'api_request', 'call_error'] as const

export function AdminLogs() {
  const [data, setData] = useState<LogsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [type, setType] = useState<string>('')

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      qs.set('page', String(page))
      qs.set('limit', String(limit))
      if (type) qs.set('type', type)
      const res = await apiGet<LogsResponse>(`/admin/logs?${qs.toString()}`)
      setData(res)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load logs')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, limit, type])

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
      <p className="adminPageSub">GET /admin/logs — paginated system events</p>

      <div className="adminToolbar" style={{ marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="adminSearchWrap" style={{ maxWidth: 220 }}>
          <label className="adminPageSub" htmlFor="log-type" style={{ display: 'block', marginBottom: 4 }}>
            Type
          </label>
          <select
            id="log-type"
            className="input-field"
            value={type}
            onChange={(e) => {
              setType(e.target.value)
              setPage(1)
            }}
          >
            {LOG_TYPES.map((t) => (
              <option key={t || 'all'} value={t}>
                {t || 'All types'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="adminPageSub">Loading…</p>}
      {error && (
        <p className="adminTokenHint" role="alert">
          {error}
        </p>
      )}

      {data && !loading && (
        <>
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Type</th>
                  <th scope="col">Message</th>
                  <th scope="col">User</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td>
                      <span className="adminPlanPill">{r.type}</span>
                    </td>
                    <td>
                      <div className="adminCellPrimary">{r.message}</div>
                      {r.metadata != null && (
                        <pre
                          className="adminCellMuted"
                          style={{ fontSize: 11, marginTop: 4, whiteSpace: 'pre-wrap' }}
                        >
                          {JSON.stringify(r.metadata, null, 2)}
                        </pre>
                      )}
                    </td>
                    <td>
                      {r.user ? (
                        <>
                          <div className="adminCellMuted">{r.user.name}</div>
                          <div className="adminCellMuted">{r.user.email}</div>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.items.length === 0 && <p className="adminEmpty">No log entries.</p>}
          </div>

          <div className="adminToolbar" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn-outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="adminPageSub">
              Page {data.page} · {data.items.length} rows
            </span>
            <button
              type="button"
              className="btn-outline"
              disabled={data.items.length < limit}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  )
}
