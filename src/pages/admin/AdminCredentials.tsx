import { MoreHorizontal, UserPlus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../components/agents/agents.css'
import { apiDelete, apiGet, apiPatch, apiPost, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'
import { CreateCustomerModal, type CreateCustomerPayload } from './CreateCustomerModal'

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

type CreateUserResponse = {
  user: { id: string; name: string; email: string; company: string; plan: string }
  password?: string
  passwordSource: 'generated' | 'provided'
  apiKey: string
  apiSecret: string
}

function formatPlanLabel(plan: string): string {
  const key = plan.toLowerCase()
  const map: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    enterprise: 'Enterprise',
    starter: 'Starter',
  }
  return map[key] ?? plan
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function AdminCredentials() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [createdInfo, setCreatedInfo] = useState<CreateUserResponse | null>(null)
  const [resetInfo, setResetInfo] = useState<{ email: string; password: string } | null>(null)
  const [actionMenuForId, setActionMenuForId] = useState<string | null>(null)

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

  useEffect(() => {
    if (!actionMenuForId) return
    function handleMouseDown(e: MouseEvent) {
      const t = e.target as HTMLElement | null
      if (t && !t.closest('[data-admin-action-menu]')) {
        setActionMenuForId(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [actionMenuForId])

  const saasUsers = users.filter((u) => u.role === 'user')

  async function handleCreate(payload: CreateCustomerPayload) {
    const res = await apiPost<CreateUserResponse>('/admin/users/create', {
      name: payload.name,
      email: payload.email,
      company: payload.company,
      plan: payload.plan,
      ...(payload.password ? { password: payload.password } : {}),
    })
    setCreatedInfo(res)
    setResetInfo(null)
    await load()
  }

  async function handleResetPassword(u: UserRow) {
    setActionMenuForId(null)
    try {
      const { password } = await apiPost<{ password: string }>('/admin/users/reset-password', {
        userId: u.id,
      })
      setResetInfo({ email: u.email, password })
      setCreatedInfo(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reset password failed')
    }
  }

  async function handleSetStatus(u: UserRow, status: 'active' | 'disabled') {
    setActionMenuForId(null)
    try {
      await apiPatch('/admin/users/status', { userId: u.id, status })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update status failed')
    }
  }

  async function handleDelete(u: UserRow) {
    setActionMenuForId(null)
    if (!window.confirm(`Delete ${u.name} (${u.email})? This cannot be undone.`)) return
    try {
      await apiDelete(`/admin/users/${u.id}`)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  if (!getStoredToken()) {
    return (
      <p className="adminTokenHint">
        No JWT — sign in from <a href="/admin/login">/admin/login</a> with a seeded admin account.
      </p>
    )
  }

  return (
    <>
      <div className="adminSaasCard">
        <div className="adminSaasCardHeader">
          <div>
            <h1 className="adminSaasCardTitle">Dashboard users</h1>
            <p className="adminSaasCardDesc">
              Create and manage login accounts for the main Call Matrix dashboard. Users sign in at{' '}
              <Link to="/login">/login</Link> (not the admin console).
            </p>
          </div>
          <button type="button" className="adminPrimaryBtn" onClick={() => setCreateOpen(true)}>
            <UserPlus size={18} strokeWidth={2} aria-hidden />
            Create user credentials
          </button>
        </div>

        {createdInfo && (
          <div className="adminHint" style={{ marginBottom: 16 }} role="status">
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>User created: {createdInfo.user.email}</p>
            {createdInfo.passwordSource === 'provided' ? (
              <p style={{ margin: '0 0 8px', fontSize: 14 }}>
                Password was set in the form. Share it with the user securely.
              </p>
            ) : (
              <>
                <p style={{ margin: '0 0 4px', fontSize: 14 }}>
                  <strong>Temporary password</strong> (copy now — shown once):
                </p>
                {createdInfo.password && (
                  <p style={{ margin: '0 0 8px' }}>
                    <code className="adminCode">{createdInfo.password}</code>
                  </p>
                )}
              </>
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
            <button type="button" className="adminGhostBtn" onClick={() => setCreatedInfo(null)}>
              Dismiss
            </button>
          </div>
        )}

        {resetInfo && (
          <div className="adminHint" style={{ marginBottom: 16 }} role="status">
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>New password for {resetInfo.email}</p>
            <p style={{ margin: '0 0 8px' }}>
              <code className="adminCode">{resetInfo.password}</code>
            </p>
            <button type="button" className="adminGhostBtn" onClick={() => setResetInfo(null)}>
              Dismiss
            </button>
          </div>
        )}

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
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Company</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created at</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {saasUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="adminCellPrimary">{u.name}</div>
                    </td>
                    <td>
                      <div className="adminCellMuted" style={{ marginTop: 0 }}>
                        {u.email}
                      </div>
                    </td>
                    <td>{u.company || '—'}</td>
                    <td>
                      <span className="adminPlanPill">{formatPlanLabel(u.plan)}</span>
                    </td>
                    <td>
                      {u.status === 'active' ? (
                        <span className="adminStatusOn">active</span>
                      ) : (
                        <span className="adminStatusOff">disabled</span>
                      )}
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div
                        className="adminActionMenuWrap"
                        data-admin-action-menu
                      >
                        <button
                          type="button"
                          className="adminActionMenuBtn"
                          aria-label="Open actions"
                          aria-haspopup="menu"
                          aria-expanded={actionMenuForId === u.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActionMenuForId((id) => (id === u.id ? null : u.id))
                          }}
                        >
                          <MoreHorizontal size={18} strokeWidth={2} />
                        </button>
                        {actionMenuForId === u.id && (
                          <ul className="adminActionMenu" role="menu">
                            <li role="none">
                              <button
                                type="button"
                                className="adminActionMenuItem"
                                role="menuitem"
                                onClick={() => void handleResetPassword(u)}
                              >
                                Reset password
                              </button>
                            </li>
                            <li role="none">
                              <button
                                type="button"
                                className="adminActionMenuItem"
                                role="menuitem"
                                onClick={() =>
                                  void handleSetStatus(
                                    u,
                                    u.status === 'active' ? 'disabled' : 'active',
                                  )
                                }
                              >
                                {u.status === 'active' ? 'Disable user' : 'Enable user'}
                              </button>
                            </li>
                            <li role="none">
                              <button
                                type="button"
                                className="adminActionMenuItem adminActionMenuItemDanger"
                                role="menuitem"
                                onClick={() => void handleDelete(u)}
                              >
                                Delete user
                              </button>
                            </li>
                          </ul>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {saasUsers.length === 0 && (
              <p className="adminEmpty">No dashboard users yet. Create credentials to get started.</p>
            )}
          </div>
        )}
      </div>

      <CreateCustomerModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        title="Create user credentials"
        submitLabel="Create credentials"
      />
    </>
  )
}
