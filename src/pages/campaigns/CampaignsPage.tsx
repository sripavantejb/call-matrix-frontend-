import { CheckCircle, Megaphone, MoreHorizontal, Play, Plus, Square } from 'lucide-react'
import { useState } from 'react'
import { NewCampaignModal } from '../../components/campaigns/NewCampaignModal'
import { CampaignDetailPanel } from '../../components/campaigns/CampaignDetailPanel'
import '../../components/agents/agents.css'
import '../../components/campaigns/campaigns.css'
import type { Campaign, CampaignType as CType } from '../../data/campaignsMock'
import { applyCampaignRunningState, CAMPAIGN_SEED } from '../../data/campaignsMock'

const pillClass = (status: Campaign['status']) => {
  if (status === 'active') return 'campPill campPillActive'
  if (status === 'completed') return 'campPill campPillCompleted'
  return 'campPill campPillInactive'
}

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGN_SEED)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Campaign | null>(null)

  const total = campaigns.length
  const active = campaigns.filter((c) => c.status === 'active').length
  const completed = campaigns.filter((c) => c.status === 'completed').length

  function handleCreate(payload: {
    name: string
    type: CType
    startTime: string
    endTime: string
    businessHoursOnly: boolean
    retryWaitMinutes: number
    maxRetries: number
  }) {
    const next: Campaign = {
      id: `camp-${Date.now()}`,
      ...payload,
      status: 'inactive',
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      workflowUrl: '',
      agents: [],
      callTags: [],
      contacts: [],
      queueBuffer: 0,
      workersRunning: 0,
      totalQueued: 0,
    }
    setCampaigns((prev) => [next, ...prev])
  }

  function handleUpdate(updated: Campaign) {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    )
    setSelected(updated)
  }

  function setCampaignRunning(id: string, running: boolean) {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? applyCampaignRunningState(c, running) : c,
      ),
    )
    setSelected((sel) => {
      if (!sel || sel.id !== id) return sel
      return applyCampaignRunningState(sel, running)
    })
  }

  return (
    <>
      {/* Header */}
      <div className="campPageHeader">
        <div>
          <h1 className="campPageTitle">Campaigns</h1>
          <p className="campPageSub">
            Create and manage automated calling campaigns.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={18} strokeWidth={2} aria-hidden />
          New campaign
        </button>
      </div>

      {/* Stat cards */}
      <div className="campStatRow">
        <div className="campStatCard">
          <div className="campStatIcon" aria-hidden>
            <Megaphone size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="campStatLabel">Total campaigns</p>
            <p className="campStatValue">{total}</p>
          </div>
        </div>
        <div className="campStatCard">
          <div className="campStatIcon" aria-hidden>
            <Play size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="campStatLabel">Active</p>
            <p className="campStatValue">{active}</p>
          </div>
        </div>
        <div className="campStatCard">
          <div className="campStatIcon" aria-hidden>
            <CheckCircle size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="campStatLabel">Completed</p>
            <p className="campStatValue">{completed}</p>
          </div>
        </div>
      </div>

      {/* Campaign list */}
      <div className="campListCard">
        <div className="campListHeader">
          <h2 className="campListTitle">All campaigns</h2>
          <span className="campListCount">{total} TOTAL</span>
        </div>
        <div className="tableScroll">
        <table className="campTable">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)}>
                <td>
                  <p className="campName">{c.name}</p>
                  <p className="campMeta">
                    {c.type}
                    <span className="campDate">
                      {c.createdAt.split(',').slice(0, 1).join('')}
                    </span>
                  </p>
                </td>
                <td>
                  <span className={pillClass(c.status)}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div
                    className="campActions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="campPlayBtn"
                      aria-label={
                        c.status === 'active' ? 'Stop campaign' : 'Start campaign'
                      }
                      title={
                        c.status === 'active' ? 'Stop campaign' : 'Start campaign'
                      }
                      onClick={() =>
                        setCampaignRunning(c.id, c.status !== 'active')
                      }
                    >
                      {c.status === 'active' ? (
                        <Square size={14} strokeWidth={2} />
                      ) : (
                        <Play size={16} strokeWidth={2} />
                      )}
                    </button>
                    <button type="button" className="campMoreBtn" aria-label="More">
                      <MoreHorizontal size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Create modal */}
      <NewCampaignModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(payload) => {
          handleCreate(payload)
          setModalOpen(false)
        }}
      />

      {/* Detail panel */}
      {selected && (
        <CampaignDetailPanel
          campaign={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onSetRunning={(running) => setCampaignRunning(selected.id, running)}
        />
      )}
    </>
  )
}
