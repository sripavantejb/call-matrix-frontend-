import { KeyRound, MoreHorizontal, UserPlus } from 'lucide-react'
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

type CredentialRow = {
  id: string
  userId: string
  apiKey: string
  label: string | null
  revokedAt: string | null
  createdAt: string
  user: { id: string; email: string; name: string; company: string | null }
}

type CreateUserResponse = {
  user: { id: string; name: string; email: string; company: string; plan: string }
  password?: string
  passwordSource: 'generated' | 'provided'
  apiKey: string
  apiSecret: string
}

type CreateCredentialApiResponse = {
  id: string
  api_key: string
  api_secret: string
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

function truncateKey(key: string, head = 10): string {
  if (key.length <= head + 3) return key
  return `${key.slice(0, head)}…`
}

export function AdminCredentials() {
  const apiReady = Boolean(getStoredToken())

  const [users, setUsers] = useState<UserRow[]>([])
  const [credentials, setCredentials] = useState<CredentialRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [createdInfo, setCreatedInfo] = useState<CreateUserResponse | null>(null)
  const [resetInfo, setResetInfo] = useState<{ email: string; password: string } | null>(null)
  const [actionMenuForId, setActionMenuForId] = useState<string | null>(null)
  const [issueUserId, setIssueUserId] = useState('')
  const [issueBusy, setIssueBusy] = useState(false)
  const [issuedCredential, setIssuedCredential] = useState<CreateCredentialApiResponse | null>(null)
  const [credActionMenuForId, setCredActionMenuForId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setUsers([])
      setCredentials([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [userList, credList] = await Promise.all([
        apiGet<UserRow[]>('/admin/users'),
        apiGet<CredentialRow[]>('/admin/credentials'),
      ])
      setUsers(userList)
      setCredentials(credList)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
      setUsers([])
      setCredentials([])
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

  useEffect(() => {
    if (!credActionMenuForId) return
    function handleMouseDown(e: MouseEvent) {
      const t = e.target as HTMLElement | null
      if (t && !t.closest('[data-admin-cred-menu]')) {
        setCredActionMenuForId(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [credActionMenuForId])

  const saasUsers = users.filter((u) => u.role === 'user')

  async function handleCreate(payload: CreateCustomerPayload) {
    if (!getStoredToken()) {
      setError('Sign in with a live API session to create users.')
      return
    }
    const res = await apiPost<CreateUserResponse>('/admin/users/create', {
      name: payload.name,
      email: payload.email,
      company: payload.company,
      plan: payload.plan,
      ...(payload.password ? { password: payload.password } : {}),
    })
    setCreatedInfo(res)
    setResetInfo(null)
    setIssuedCredential(null)
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

  async function handleIssueCredential() {
    if (!apiReady || !issueUserId) return
    setIssueBusy(true)
    setError(null)
    try {
      const res = await apiPost<CreateCredentialApiResponse>('/admin/credentials/create', {
        user_id: issueUserId,
      })
      setIssuedCredential(res)
      setCreatedInfo(null)
      setResetInfo(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create credential')
    } finally {
      setIssueBusy(false)
    }
  }

  async function handleRevokeCredential(c: CredentialRow) {
    setCredActionMenuForId(null)
    if (!apiReady) return
    if (
      !window.confirm(
        `Revoke this API credential for ${c.user.email}? Integrations using this key will stop working.`,
      )
    ) {
      return
    }
    try {
      await apiDelete(`/admin/credentials/${c.id}`)
      setIssuedCredential(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Revoke failed')
    }
  }

  return (
    <>
      {!apiReady && (
        <p className="adminTokenHint" style={{ marginTop: 0, marginBottom: 16 }}>
          <strong>No API session</strong> — listing users, creating users, and managing API keys require a JWT.
          Start the backend, then sign out and sign in again at{' '}
          <Link to="/admin/login">/admin/login</Link> so the admin login can obtain a token.
        </p>
      )}

      <div className="adminSaasCard">
        <div className="adminSaasCardHeader">
          <div>
            <h1 className="adminSaasCardTitle">Dashboard users</h1>
            <p className="adminSaasCardDesc">
              Create and manage login accounts for the main Call Matrix dashboard. Users sign in at{' '}
              <Link to="/login">/login</Link> (not the admin console).
            </p>
          </div>
          <button
            type="button"
            className="adminPrimaryBtn"
            disabled={!apiReady}
            onClick={() => setCreateOpen(true)}
          >
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
                      <div className="adminActionMenuWrap" data-admin-action-menu>
                        <button
                          type="button"
                          className="adminActionMenuBtn"
                          aria-label="Open actions"
                          aria-haspopup="menu"
                          aria-expanded={actionMenuForId === u.id}
                          disabled={!apiReady}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!apiReady) return
                            setActionMenuForId((id) => (id === u.id ? null : u.id))
                          }}
                        >
                          <MoreHorizontal size={18} strokeWidth={2} />
                        </button>
                        {actionMenuForId === u.id && apiReady && (
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
              <p className="adminEmpty">
                {apiReady
                  ? 'No dashboard users yet. Create credentials to get started.'
                  : 'No data loaded — connect the API to list dashboard users.'}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="adminSaasCard">
        <div className="adminSaasCardHeader">
          <div>
            <h2 className="adminSaasCardTitle">API credentials</h2>
            <p className="adminSaasCardDesc">
              Issue additional API keys for dashboard users (for integrations). Each user must keep at least one
              active credential; the secret is shown only once when created.
            </p>
          </div>
        </div>

        {issuedCredential && (
          <div className="adminHint" style={{ marginBottom: 16 }} role="status">
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>New API credential issued</p>
            <p style={{ margin: '0 0 4px', fontSize: 14 }}>
              <strong>API key / secret</strong> (copy now — secret shown once):
            </p>
            <p style={{ margin: '0 0 4px' }}>
              <code className="adminCode">{issuedCredential.api_key}</code>
            </p>
            <p style={{ margin: '0 0 8px' }}>
              <code className="adminCode">{issuedCredential.api_secret}</code>
            </p>
            <button type="button" className="adminGhostBtn" onClick={() => setIssuedCredential(null)}>
              Dismiss
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'flex-end',
            marginBottom: 18,
          }}
        >
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <label className="fieldLabel" htmlFor="cred-issue-user" style={{ display: 'block', marginBottom: 6 }}>
              Dashboard user
            </label>
            <select
              id="cred-issue-user"
              className="input-field"
              value={issueUserId}
              onChange={(e) => setIssueUserId(e.target.value)}
              disabled={!apiReady || loading}
            >
              <option value="">Select a user…</option>
              {saasUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="adminPrimaryBtn"
            disabled={!apiReady || !issueUserId || issueBusy || loading}
            onClick={() => void handleIssueCredential()}
          >
            <KeyRound size={18} strokeWidth={2} aria-hidden />
            {issueBusy ? 'Issuing…' : 'Issue credential'}
          </button>
        </div>

        {!loading && (
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">API key</th>
                  <th scope="col">Label</th>
                  <th scope="col">Created</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {credentials.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="adminCellPrimary">{c.user.name}</div>
                      <div className="adminCellMuted" style={{ marginTop: 0 }}>
                        {c.user.email}
                      </div>
                    </td>
                    <td>
                      <code className="adminCode">{truncateKey(c.apiKey)}</code>
                    </td>
                    <td>{c.label ?? '—'}</td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      {c.revokedAt ? (
                        <span className="adminStatusOff">revoked</span>
                      ) : (
                        <span className="adminStatusOn">active</span>
                      )}
                    </td>
                    <td>
                      <div className="adminActionMenuWrap" data-admin-cred-menu>
                        <button
                          type="button"
                          className="adminActionMenuBtn"
                          aria-label="Open credential actions"
                          aria-haspopup="menu"
                          aria-expanded={credActionMenuForId === c.id}
                          disabled={!apiReady || Boolean(c.revokedAt)}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!apiReady || c.revokedAt) return
                            setCredActionMenuForId((id) => (id === c.id ? null : c.id))
                          }}
                        >
                          <MoreHorizontal size={18} strokeWidth={2} />
                        </button>
                        {credActionMenuForId === c.id && apiReady && !c.revokedAt && (
                          <ul className="adminActionMenu" role="menu">
                            <li role="none">
                              <button
                                type="button"
                                className="adminActionMenuItem adminActionMenuItemDanger"
                                role="menuitem"
                                onClick={() => void handleRevokeCredential(c)}
                              >
                                Revoke credential
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
            {credentials.length === 0 && (
              <p className="adminEmpty">
                {apiReady
                  ? 'No API credentials loaded, or none exist yet. Issue a credential for a dashboard user above.'
                  : 'No data loaded — connect the API to list API credentials.'}
              </p>
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
