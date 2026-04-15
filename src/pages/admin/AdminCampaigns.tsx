import { useCallback, useEffect, useState } from 'react'
import { apiDelete, apiGet, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'

type CampaignRow = {
  id: string
  campaignName: string
  status: string
  createdAt: string
  user: { id: string; email: string; name: string }
  agent: { id: string; agentName: string }
}

export function AdminCampaigns() {
  const [rows, setRows] = useState<CampaignRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const list = await apiGet<CampaignRow[]>('/admin/campaigns')
      setRows(list)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load campaigns')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete campaign “${name}”?`)) return
    try {
      await apiDelete(`/admin/campaigns/${id}`)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  if (!getStoredToken()) {
    return (
      <p className="adminTokenHint">
        No JWT — sign in from <a href="/admin/login">/admin/login</a>.
      </p>
    )
  }

  return (
    <>
      <p className="adminPageSub">GET /admin/campaigns · DELETE /admin/campaigns/:id</p>
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
                <th scope="col">Campaign</th>
                <th scope="col">Status</th>
                <th scope="col">Agent</th>
                <th scope="col">Tenant</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="adminCellPrimary">{r.campaignName}</td>
                  <td>
                    <span className="adminPlanPill">{r.status}</span>
                  </td>
                  <td>{r.agent.agentName}</td>
                  <td>
                    <div className="adminCellMuted">{r.user.name}</div>
                    <div className="adminCellMuted">{r.user.email}</div>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      className="adminGhostBtn adminGhostDanger"
                      onClick={() => void handleDelete(r.id, r.campaignName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="adminEmpty">No campaigns.</p>}
        </div>
      )}
    </>
  )
}
