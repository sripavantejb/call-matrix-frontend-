import { Search, User, X } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useAgents } from '../../hooks/useAgents'
import type { Campaign } from '../../data/campaignsMock'
import './campaigns.css'

export type AssignableAgentRow = {
  sourceAgentId: string
  name: string
  displayAgentId: number
  created: string
}

function stableAgentNumber(sourceAgentId: string): number {
  let h = 0
  for (let i = 0; i < sourceAgentId.length; i++) {
    h = (Math.imul(31, h) + sourceAgentId.charCodeAt(i)) | 0
  }
  return 100 + (Math.abs(h) % 900)
}

function isAlreadyOnCampaign(campaign: Campaign, sourceAgentId: string, name: string) {
  return campaign.agents.some(
    (ca) =>
      (ca.sourceAgentId && ca.sourceAgentId === sourceAgentId) ||
      (!ca.sourceAgentId && ca.name === name),
  )
}

type Props = {
  open: boolean
  onClose: () => void
  campaign: Campaign
  onAssign: (row: AssignableAgentRow) => void
}

export function SelectAgentModal({
  open,
  onClose,
  campaign,
  onAssign,
}: Props) {
  const titleId = useId()
  const { agents } = useAgents()
  const [q, setQ] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const rows = useMemo(() => {
    const list: AssignableAgentRow[] = []
    for (const a of agents) {
      if (isAlreadyOnCampaign(campaign, a.id, a.name)) continue
      list.push({
        sourceAgentId: a.id,
        name: a.name,
        displayAgentId: stableAgentNumber(a.id),
        created: a.created,
      })
    }
    const s = q.trim().toLowerCase()
    if (!s) return list
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        String(r.displayAgentId).includes(s),
    )
  }, [agents, campaign, q])

  useEffect(() => {
    if (!open) return
    setQ('')
    setSelectedId(null)
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

  const selected = rows.find((r) => r.sourceAgentId === selectedId)

  return (
    <div
      className="campModalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="campSelectAgentModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="campSelectAgentHead">
          <div>
            <h2 id={titleId} className="campSelectAgentTitle">
              Select Agent
            </h2>
            <p className="campSelectAgentSub">
              Choose an agent to assign to this campaign.
            </p>
          </div>
          <button
            type="button"
            className="campModalClose"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="campSelectAgentSearch">
          <Search size={18} strokeWidth={1.75} color="var(--text-secondary)" aria-hidden />
          <input
            type="search"
            placeholder="Search agents..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search agents"
          />
        </div>

        <div className="campSelectAgentList" role="listbox" aria-label="Available agents">
          {rows.length === 0 ? (
            <p className="campSelectAgentEmpty">
              {agents.length === 0
                ? 'No agents in your workspace yet.'
                : 'All agents are already assigned to this campaign.'}
            </p>
          ) : (
            rows.map((r) => (
              <button
                key={r.sourceAgentId}
                type="button"
                role="option"
                aria-selected={selectedId === r.sourceAgentId}
                className={`campSelectAgentRow${selectedId === r.sourceAgentId ? ' campSelectAgentRowSelected' : ''}`}
                onClick={() => setSelectedId(r.sourceAgentId)}
              >
                <div className="campSelectAgentAvatar" aria-hidden>
                  <User size={20} strokeWidth={1.75} />
                </div>
                <div className="campSelectAgentMeta">
                  <p className="campSelectAgentName">{r.name}</p>
                  <p className="campSelectAgentIds">
                    Agent ID: {r.displayAgentId}
                    <span className="campSelectAgentDot" />
                    Created: {r.created}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="campSelectAgentFooter">
          <span className="campSelectAgentCount">
            {rows.length} agent{rows.length === 1 ? '' : 's'} available
          </span>
          <div className="campSelectAgentFooterBtns">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={!selected}
              onClick={() => {
                if (selected) onAssign(selected)
              }}
            >
              Assign agent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
