import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPatch, apiPost, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'
import { CreateCustomerModal, type CreateCustomerPayload } from './CreateCustomerModal'

type CreateUserResponse = {
  user: { id: string; name: string; email: string; company: string; plan: string }
  password?: string
  passwordSource: 'generated' | 'provided'
  apiKey: string
  apiSecret: string
}

type UserRow = {
  id: string
  name: string
  email: string
  role: string
  company: string
  plan: string
  status: string
  createdAt: string
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [createdInfo, setCreatedInfo] = useState<CreateUserResponse | null>(null)

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setUsers([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const list = await apiGet<UserRow[]>('/admin/users')
      setUsers(list)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleCreate(payload: CreateCustomerPayload) {
    const res = await apiPost<CreateUserResponse>('/admin/users/create', {
      name: payload.name,
      email: payload.email,
      company: payload.company,
      plan: payload.plan,
      ...(payload.password ? { password: payload.password } : {}),
    })
    setCreatedInfo(res)
    await load()
  }

  async function toggleStatus(u: UserRow) {
    const next = u.status === 'active' ? 'disabled' : 'active'
    await apiPatch(`/admin/users/${u.id}`, { status: next })
    await load()
  }

  async function removeUser(u: UserRow) {
    if (!window.confirm(`Delete ${u.email}?`)) return
    await apiDelete(`/admin/users/${u.id}`)
    await load()
  }

  if (!getStoredToken()) {
    return (
      <>
        <p className="adminTokenHint">
          No JWT in localStorage. Configure <code className="adminCode">VITE_API_URL</code> and sign
          in with a valid admin user so the API can return the customer list.
        </p>
      </>
    )
  }

  return (
    <>
      <p className="adminPageSub">GET /admin/users · POST /admin/users/create</p>

      {createdInfo && (
        <div className="adminTokenHint" style={{ marginBottom: 16 }} role="status">
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>User created: {createdInfo.user.email}</p>
          {createdInfo.passwordSource === 'provided' ? (
            <p style={{ margin: '0 0 8px', fontSize: 14 }}>
              Login password was set by you (not shown again). Share it with the user securely.
            </p>
          ) : (
            <p style={{ margin: '0 0 4px', fontSize: 14 }}>
              <strong>Temporary login password</strong> (copy now):
            </p>
          )}
          {createdInfo.password && (
            <p style={{ margin: '0 0 8px' }}>
              <code className="adminCode">{createdInfo.password}</code>
            </p>
          )}
          <p style={{ margin: '0 0 4px', fontSize: 14 }}>
            <strong>API key / secret</strong> (copy now):
          </p>
          <p style={{ margin: '0 0 4px' }}>
            <code className="adminCode">{createdInfo.apiKey}</code>
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <code className="adminCode">{createdInfo.apiSecret}</code>
          </p>
          <button
            type="button"
            className="adminGhostBtn"
            onClick={() => setCreatedInfo(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="adminToolbar" style={{ marginBottom: 16 }}>
        <button type="button" className="adminPrimaryBtn" onClick={() => setCreateOpen(true)}>
          <Plus size={18} strokeWidth={2} aria-hidden />
          Create user
        </button>
      </div>

      {loading && <p className="adminPageSub">Loading…</p>}
      {error && (
        <p className="adminTokenHint" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Plan</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="adminCellPrimary">{u.name}</div>
                    <div className="adminCellMuted">{u.email}</div>
                    <div className="adminCellMuted">{u.company}</div>
                  </td>
                  <td>
                    <span className="adminPlanPill">{u.plan}</span>
                  </td>
                  <td>{u.role}</td>
                  <td>
                    <span className={u.status === 'active' ? 'adminStatusOn' : 'adminStatusOff'}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="adminRowActions">
                      <button
                        type="button"
                        className="adminGhostBtn"
                        onClick={() => toggleStatus(u)}
                      >
                        {u.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        className="adminGhostBtn adminGhostDanger"
                        onClick={() => removeUser(u)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="adminEmpty">No users yet.</p>
          )}
        </div>
      )}

      <CreateCustomerModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </>
  )
}
