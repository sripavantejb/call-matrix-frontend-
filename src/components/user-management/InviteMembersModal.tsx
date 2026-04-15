import { Send, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import type { TeamMemberRole } from '../../data/userManagementMock'
import '../agents/agents.css'
import '../../pages/user-management/user-management.css'

export type InviteMembersModalProps = {
  open: boolean
  onClose: () => void
  /** Return true if invitations were added (modal will close). */
  onSend: (emails: string[], role: TeamMemberRole) => boolean
}

function parseInviteEmails(raw: string): string[] {
  const parts = raw.split(/[,\n]+/)
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of parts) {
    const t = p.trim()
    if (!t) continue
    const k = t.toLowerCase()
    if (!seen.has(k)) {
      seen.add(k)
      out.push(t)
    }
  }
  return out
}

export function InviteMembersModal({
  open,
  onClose,
  onSend,
}: InviteMembersModalProps) {
  const titleId = useId()
  const [body, setBody] = useState('')
  const [role, setRole] = useState<TeamMemberRole>('member')

  useEffect(() => {
    if (!open) {
      setBody('')
      setRole('member')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const emails = parseInviteEmails(body)
  const canSend = emails.length > 0

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modalPanel"
        style={{ maxWidth: 520 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modalHeader">
          <h2 id={titleId} className="modalTitle">
            Invite Team Members
          </h2>
          <button
            type="button"
            className="modalClose"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={22} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <div className="fieldStack" style={{ gap: 20 }}>
          <div>
            <label className="fieldLabel" htmlFor="um-invite-emails">
              Email addresses
            </label>
            <textarea
              id="um-invite-emails"
              className="umInviteTextarea"
              placeholder="john@company.com, jane@company.com (comma or newline separated)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div>
            <label className="fieldLabel" htmlFor="um-invite-role">
              Role
            </label>
            <select
              id="um-invite-role"
              className="selectField"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as TeamMemberRole)
              }
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="umModalFooter">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canSend}
            onClick={() => {
              if (onSend(emails, role)) onClose()
            }}
          >
            <Send size={18} strokeWidth={2} aria-hidden />
            Send Invitations
          </button>
        </div>
      </div>
    </div>
  )
}
