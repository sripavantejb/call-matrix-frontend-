import { UserPlus } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { InviteMembersModal } from '../../components/user-management/InviteMembersModal'
import '../../components/agents/agents.css'
import {
  MOCK_ACCESS_REQUESTS,
  MOCK_TEAM_MEMBERS,
  type TeamMember,
  type TeamMemberRole,
} from '../../data/userManagementMock'
import './user-management.css'

type TabId = 'team' | 'access' | 'invitations'

type SentInvitation = {
  id: string
  email: string
  role: TeamMemberRole
  sentAt: Date
  status: 'pending'
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function rolePillClass(role: TeamMember['role']) {
  return role === 'admin' ? 'umPillRoleAdmin' : 'umPillRoleMember'
}

function roleLabel(role: TeamMember['role']) {
  return role === 'admin' ? 'Admin' : 'Member'
}

function statusPillClass(status: TeamMember['status']) {
  return status === 'active' ? 'umPillStatusActive' : 'umPillStatusInvited'
}

function statusLabel(status: TeamMember['status']) {
  return status === 'active' ? 'Active' : 'Invited'
}

function initialFromName(name: string) {
  const t = name.trim()
  return t ? t[0]!.toUpperCase() : '?'
}

export function UserManagementPage() {
  const tablistId = useId()
  const [activeTab, setActiveTab] = useState<TabId>('team')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([])

  const accessCount = MOCK_ACCESS_REQUESTS.length
  const teamCount = MOCK_TEAM_MEMBERS.length
  const inviteCount = sentInvitations.length

  const tabs = useMemo(
    () =>
      [
        { id: 'team' as const, label: `Team Members (${teamCount})` },
        { id: 'access' as const, label: `Access Requests (${accessCount})` },
        {
          id: 'invitations' as const,
          label: `Invitations (${inviteCount})`,
        },
      ] as const,
    [teamCount, accessCount, inviteCount],
  )

  const handleSendInvites = (emails: string[], role: TeamMemberRole) => {
    const now = new Date()
    const existing = new Set(
      sentInvitations.map((i) => i.email.toLowerCase()),
    )
    const next: SentInvitation[] = []
    for (const email of emails) {
      const k = email.toLowerCase()
      if (existing.has(k)) continue
      existing.add(k)
      next.push({
        id: `${now.getTime()}-${k}`,
        email,
        role,
        sentAt: now,
        status: 'pending',
      })
    }
    if (next.length === 0) return false
    setSentInvitations((prev) => [...next, ...prev])
    setActiveTab('invitations')
    return true
  }

  return (
    <>
      <div className="agentsPageHeader">
        <div>
          <h1 className="agentsPageTitle">User Management</h1>
          <p className="agentsPageSub">
            Manage your team members, access requests, and invitations.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus size={18} strokeWidth={2} aria-hidden />
          Invite Members
        </button>
      </div>

      <div
        className="umTabs"
        role="tablist"
        id={tablistId}
        aria-label="User management sections"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${tablistId}-${t.id}`}
            aria-selected={activeTab === t.id}
            className={`umTab${activeTab === t.id ? ' umTabActive' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'team' && (
        <div role="tabpanel" aria-labelledby={`${tablistId}-team`}>
          <div className="agentsTableCard">
            <h2 className="agentsTableTitle">Team members</h2>
            <div className="tableScroll">
            <table className="agentsTable agentsTable--mobileCards">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TEAM_MEMBERS.map((m) => (
                  <tr key={m.id}>
                    <td data-label="Member">
                      <div className="umMemberCell">
                        <span className="umAvatar" aria-hidden>
                          {initialFromName(m.displayName)}
                        </span>
                        <div className="umMemberText">
                          <p className="umMemberName">
                            {m.displayName}
                            {m.isYou ? ' (you)' : ''}
                          </p>
                          <p className="umMemberEmail">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Role">
                      <span className={rolePillClass(m.role)}>
                        {roleLabel(m.role)}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span className={statusPillClass(m.status)}>
                        {statusLabel(m.status)}
                      </span>
                    </td>
                    <td className="agentsCellMuted" data-label="Joined">
                      {formatDate(m.joinedAt)}
                    </td>
                    <td className="agentsCellMuted" data-label="Last active">
                      {formatDate(m.lastActiveAt)}
                    </td>
                    <td className="agentsCellMuted" data-label="Actions">
                      —
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'access' && (
        <div role="tabpanel" aria-labelledby={`${tablistId}-access`}>
          <div className="agentsTableCard">
            <div className="umEmptyPanel">
              <p className="umEmptyText">No pending access requests.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invitations' && (
        <div role="tabpanel" aria-labelledby={`${tablistId}-invitations`}>
          {sentInvitations.length === 0 ? (
            <div className="agentsTableCard">
              <div className="umEmptyPanel">
                <p className="umEmptyText">No invitations yet.</p>
                <button
                  type="button"
                  className="umEmptyLink"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite your first team member.
                </button>
              </div>
            </div>
          ) : (
            <div className="agentsTableCard">
              <h2 className="agentsTableTitle">Invitations</h2>
              <div className="tableScroll">
              <table className="agentsTable">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Sent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sentInvitations.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.email}</td>
                      <td>
                        <span className={rolePillClass(inv.role)}>
                          {roleLabel(inv.role)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(inv.sentAt)}
                      </td>
                      <td>
                        <span className="umPillPending">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      )}

      <InviteMembersModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSend={handleSendInvites}
      />
    </>
  )
}
