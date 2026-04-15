import { useCallback, useEffect, useState } from 'react'
import { apiGet, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'

type CallRow = {
  id: string
  phoneNumber: string
  callStatus: string
  duration: number
  recordingUrl: string | null
  createdAt: string
  campaign: {
    id: string
    campaignName: string
    userId: string
    user: { email: string; name: string }
  }
}

function buildQuery(params: {
  from: string
  to: string
  userId: string
  campaignId: string
}): string {
  const qs = new URLSearchParams()
  if (params.from.trim()) {
    const d = new Date(params.from + 'T00:00:00.000Z')
    qs.set('from', d.toISOString())
  }
  if (params.to.trim()) {
    const d = new Date(params.to + 'T23:59:59.999Z')
    qs.set('to', d.toISOString())
  }
  if (params.userId.trim()) qs.set('userId', params.userId.trim())
  if (params.campaignId.trim()) qs.set('campaignId', params.campaignId.trim())
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export function AdminCalls() {
  const [rows, setRows] = useState<CallRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [userId, setUserId] = useState('')
  const [campaignId, setCampaignId] = useState('')

  const applyFilters = useCallback(async () => {
    if (!getStoredToken()) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const q = buildQuery({ from, to, userId, campaignId })
      const list = await apiGet<CallRow[]>(`/admin/calls${q}`)
      setRows(list)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load calls')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [from, to, userId, campaignId])

  useEffect(() => {
    void applyFilters()
    // initial load only; use "Apply filters" for updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!getStoredToken()) {
    return (
      <p className="adminTokenHint">
        No JWT — sign in from <a href="/admin/login">/admin/login</a>.
      </p>
    )
  }

  return (
    <>
      <p className="adminPageSub">GET /admin/calls — optional filters below (max 500 rows)</p>

      <div className="adminToolbar" style={{ marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="adminSearchWrap" style={{ maxWidth: 160 }}>
          <label className="adminPageSub" htmlFor="call-from" style={{ display: 'block', marginBottom: 4 }}>
            From
          </label>
          <input
            id="call-from"
            className="input-field"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="adminSearchWrap" style={{ maxWidth: 160 }}>
          <label className="adminPageSub" htmlFor="call-to" style={{ display: 'block', marginBottom: 4 }}>
            To
          </label>
          <input
            id="call-to"
            className="input-field"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="adminSearchWrap" style={{ maxWidth: 280 }}>
          <label className="adminPageSub" htmlFor="call-user" style={{ display: 'block', marginBottom: 4 }}>
            User ID (UUID)
          </label>
          <input
            id="call-user"
            className="input-field"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="optional"
          />
        </div>
        <div className="adminSearchWrap" style={{ maxWidth: 280 }}>
          <label className="adminPageSub" htmlFor="call-campaign" style={{ display: 'block', marginBottom: 4 }}>
            Campaign ID (UUID)
          </label>
          <input
            id="call-campaign"
            className="input-field"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            placeholder="optional"
          />
        </div>
        <button type="button" className="btn-primary" onClick={() => void applyFilters()}>
          Apply filters
        </button>
      </div>

      {loading && <p className="adminPageSub">Loading…</p>}
      {error && (
        <p className="adminTokenHint" role="alert">
          {error}
        </p>
      )}
      {!loading && (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Phone</th>
                <th scope="col">Status</th>
                <th scope="col">Duration (s)</th>
                <th scope="col">Campaign</th>
                <th scope="col">Tenant</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>{r.phoneNumber}</td>
                  <td>{r.callStatus}</td>
                  <td>{r.duration}</td>
                  <td>{r.campaign.campaignName}</td>
                  <td>
                    <div className="adminCellMuted">{r.campaign.user.name}</div>
                    <div className="adminCellMuted">{r.campaign.user.email}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="adminEmpty">No calls match.</p>}
        </div>
      )}
    </>
  )
}
