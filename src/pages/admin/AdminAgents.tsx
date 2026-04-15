import { useCallback, useEffect, useState } from 'react'
import { apiDelete, apiGet, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'

type AgentRow = {
  id: string
  agentName: string
  voice: string
  language: string
  createdAt: string
  user: { id: string; email: string; name: string; company: string }
}

export function AdminAgents() {
  const [rows, setRows] = useState<AgentRow[]>([])
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
      const list = await apiGet<AgentRow[]>('/admin/agents')
      setRows(list)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load agents')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete agent “${name}”?`)) return
    try {
      await apiDelete(`/admin/agents/${id}`)
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
      <p className="adminPageSub">GET /admin/agents · DELETE /admin/agents/:id</p>
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
                <th scope="col">Agent</th>
                <th scope="col">Tenant</th>
                <th scope="col">Voice / language</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="adminCellPrimary">{r.agentName}</td>
                  <td>
                    <div className="adminCellMuted">{r.user.name}</div>
                    <div className="adminCellMuted">{r.user.email}</div>
                  </td>
                  <td>
                    {r.voice} · {r.language}
                  </td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      className="adminGhostBtn adminGhostDanger"
                      onClick={() => void handleDelete(r.id, r.agentName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="adminEmpty">No agents.</p>}
        </div>
      )}
    </>
  )
}
