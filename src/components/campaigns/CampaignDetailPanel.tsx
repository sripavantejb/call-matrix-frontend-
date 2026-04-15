import {
  Bot,
  CheckCircle,
  ChevronRight,
  CircleDot,
  Download,
  Info,
  PhoneOff,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Campaign } from '../../data/campaignsMock'
import { SelectAgentModal } from './SelectAgentModal'
import './campaigns.css'

type Tab = 'overview' | 'agents' | 'callTags' | 'contacts' | 'queue'

type Props = {
  campaign: Campaign
  onClose: () => void
  onUpdate: (c: Campaign) => void
  onSetRunning: (running: boolean) => void
}

const TAB_ITEMS: { key: Tab; label: string; icon: typeof Info }[] = [
  { key: 'overview', label: 'Overview', icon: Info },
  { key: 'agents', label: 'Agents', icon: Users },
  { key: 'callTags', label: 'Call Tags', icon: Zap },
  { key: 'contacts', label: 'Contacts', icon: Upload },
  { key: 'queue', label: 'Queue', icon: CircleDot },
]

export function CampaignDetailPanel({
  campaign,
  onClose,
  onUpdate,
  onSetRunning,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [retryEnabled, setRetryEnabled] = useState(true)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className="campDetailOverlay" onClick={onClose} />
      <div className="campDetailPanel">
        {/* Head */}
        <div className="campDetailHead">
          <div className="campDetailHeadText">
            <h2 className="campDetailTitle">{campaign.name}</h2>
            <p className="campDetailSubtitle">
              {campaign.type === 'outbound' ? 'Outbound' : 'Inbound'} Campaign
            </p>
          </div>
          <div className="campDetailHeadActions">
            {campaign.status === 'completed' ? null : campaign.status === 'active' ? (
              <button
                type="button"
                className="btn-outline"
                onClick={() => onSetRunning(false)}
              >
                Stop campaign
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => onSetRunning(true)}
              >
                Start campaign
              </button>
            )}
            <button
              type="button"
              className="campDetailClose"
              aria-label="Close"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="campDetailTabs">
          {TAB_ITEMS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`campDetailTab ${tab === t.key ? 'campDetailTabActive' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="campDetailBody">
          {tab === 'overview' && (
            <OverviewTab
              campaign={campaign}
              retryEnabled={retryEnabled}
              onToggleRetry={() => setRetryEnabled((p) => !p)}
              onUpdate={onUpdate}
            />
          )}
          {tab === 'agents' && (
            <AgentsTab campaign={campaign} onUpdate={onUpdate} />
          )}
          {tab === 'callTags' && <CallTagsTab campaign={campaign} onUpdate={onUpdate} />}
          {tab === 'contacts' && <ContactsTab campaign={campaign} />}
          {tab === 'queue' && <QueueTab campaign={campaign} />}
        </div>
      </div>
    </>
  )
}

/* ────────────────────────────────────────────────────
   Overview Tab
   ──────────────────────────────────────────────────── */

function OverviewTab({
  campaign,
  retryEnabled,
  onToggleRetry,
  onUpdate,
}: {
  campaign: Campaign
  retryEnabled: boolean
  onToggleRetry: () => void
  onUpdate: (c: Campaign) => void
}) {
  return (
    <>
      {/* Campaign Information */}
      <div className="campInfoCard">
        <div className="campInfoHead">
          <h3 className="campInfoTitle">Campaign Information</h3>
          <button type="button" className="campLinkLike">
            Edit
          </button>
        </div>
        <div className="campInfoRow">
          <span className="campInfoLabel">Campaign Name:</span>
          <span className="campInfoValue">{campaign.name}</span>
        </div>
        <div className="campInfoRow">
          <span className="campInfoLabel">Type:</span>
          <span className="campInfoValue" style={{ textTransform: 'capitalize' }}>
            {campaign.type}
          </span>
        </div>
        <div className="campInfoRow">
          <span className="campInfoLabel">Start Time:</span>
          <span className="campInfoValue">{campaign.startTime}</span>
        </div>
        <div className="campInfoRow">
          <span className="campInfoLabel">End Time:</span>
          <span className="campInfoValue">{campaign.endTime}</span>
        </div>
        <div className="campInfoRow">
          <span className="campInfoLabel">Created:</span>
          <span className="campInfoValue">{campaign.createdAt}</span>
        </div>
        <div className="campInfoRow">
          <span className="campInfoLabel">Workflow URL:</span>
          <span className="campInfoValue">
            {campaign.workflowUrl ? (
              <a
                href={campaign.workflowUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--link)', textDecoration: 'underline' }}
              >
                {campaign.workflowUrl}
              </a>
            ) : (
              <button
                type="button"
                className="btn-primary"
                style={{ fontSize: 12, padding: '5px 12px' }}
                onClick={() =>
                  onUpdate({ ...campaign, workflowUrl: 'https://example.com/hook' })
                }
              >
                Add URL
              </button>
            )}
          </span>
        </div>
      </div>

      {/* Retry toggle */}
      <div className="campToggleRow">
        <span className="campToggleLabel">Retry unanswered calls</span>
        <button
          type="button"
          className="campSwitch"
          style={{
            background: retryEnabled ? 'var(--text-primary)' : 'var(--bg-subtle)',
          }}
          onClick={onToggleRetry}
          aria-pressed={retryEnabled}
        >
          <span
            className="campSwitchKnob"
            style={{ left: retryEnabled ? 21 : 3 }}
          />
        </button>
      </div>

      {/* Quick Retries */}
      <div className="campRetryCard">
        <div className="campRetryHead">
          <span className="campRetryTitle">Quick Retries</span>
          <button type="button" className="campLinkLike">
            Edit
          </button>
        </div>
        <p className="campRetryValue">
          Max: <strong>{campaign.maxRetries} retries</strong> &nbsp;|&nbsp;
          Wait: <strong>{campaign.retryWaitMinutes} min</strong>
        </p>
      </div>

      {/* Follow-up Schedule */}
      <div className="campSectionCard">
        <div className="campSectionHead">
          <span className="campSectionTitle">Follow-up Schedule</span>
          <button type="button" className="campLinkLike">
            Add
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
          No follow-up schedule. Retries use flat delay only.
        </p>
      </div>

      {/* How It Works */}
      <div className="campSectionCard">
        <span className="campSectionTitle">How It Works</span>
        <div className="campTimeline" style={{ marginTop: 12 }}>
          <div className="campTimelineItem">
            <span className="campTimelineDot" />
            <span className="campTimelineText">
              <strong>Initial call</strong>
            </span>
          </div>
          <div className="campTimelineItem">
            <span className="campTimelineDot" style={{ background: 'var(--text-secondary)' }} />
            <span className="campTimelineText">
              If not picked, retry {campaign.maxRetries} times, {campaign.retryWaitMinutes} min apart
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

/* ────────────────────────────────────────────────────
   Agents Tab
   ──────────────────────────────────────────────────── */

function AgentsTab({
  campaign,
  onUpdate,
}: {
  campaign: Campaign
  onUpdate: (c: Campaign) => void
}) {
  const [selectAgentOpen, setSelectAgentOpen] = useState(false)

  return (
    <>
      <div className="campTabHead">
        <h3 className="campTabHeadTitle">Campaign Agents</h3>
        <button
          type="button"
          className="btn-primary"
          style={{ fontSize: 13, padding: '8px 14px' }}
          onClick={() => setSelectAgentOpen(true)}
        >
          <Plus size={15} /> Add Agent
        </button>
      </div>

      <SelectAgentModal
        open={selectAgentOpen}
        onClose={() => setSelectAgentOpen(false)}
        campaign={campaign}
        onAssign={(row) => {
          onUpdate({
            ...campaign,
            agents: [
              ...campaign.agents,
              {
                id: `ca-${Date.now()}`,
                name: row.name,
                agentId: row.displayAgentId,
                status: 'active',
                sourceAgentId: row.sourceAgentId,
              },
            ],
          })
          setSelectAgentOpen(false)
        }}
      />

      {campaign.agents.length === 0 ? (
        <div className="campEmpty">
          <Bot size={32} strokeWidth={1.5} />
          <p>No agents assigned yet.</p>
        </div>
      ) : (
        campaign.agents.map((a) => (
          <div key={a.id} className="campAgentCard">
            <div className="campAgentAvatar">
              <Bot size={20} strokeWidth={1.75} />
            </div>
            <div className="campAgentInfo">
              <p className="campAgentName">{a.name}</p>
              <p className="campAgentId">Agent ID: {a.agentId}</p>
            </div>
            <span
              className={`campAgentBadge ${a.status === 'active' ? 'campAgentBadgeActive' : ''}`}
            >
              {a.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            {a.status === 'active' && (
              <button type="button" className="campStopBtn">
                Stop Calling
              </button>
            )}
            <button type="button" className="campDetailClose" aria-label="Remove">
              <X size={14} />
            </button>
          </div>
        ))
      )}
    </>
  )
}

/* ────────────────────────────────────────────────────
   Call Tags Tab
   ──────────────────────────────────────────────────── */

const TAG_COLORS = [
  '#EF4444', '#F97316', '#22C55E', '#10B981',
  '#A855F7', '#3B82F6', '#F59E0B',
  '#06B6D4', '#EC4899',
] as const

function CallTagsTab({
  campaign,
  onUpdate,
}: {
  campaign: Campaign
  onUpdate: (c: Campaign) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [tagName, setTagName] = useState('')
  const [tagDesc, setTagDesc] = useState('')
  const [tagColor, setTagColor] = useState<(typeof TAG_COLORS)[number]>(
    TAG_COLORS[4],
  )

  function resetModal() {
    setTagName('')
    setTagDesc('')
    setTagColor(TAG_COLORS[4])
  }

  function handleAdd() {
    if (!tagName.trim()) return
    const newTag = {
      id: `ct-${Date.now()}`,
      label: tagName.trim(),
      color: tagColor,
      description: tagDesc.trim(),
    }
    onUpdate({ ...campaign, callTags: [...campaign.callTags, newTag] })
    resetModal()
    setModalOpen(false)
  }

  function handleRemove(id: string) {
    onUpdate({
      ...campaign,
      callTags: campaign.callTags.filter((t) => t.id !== id),
    })
  }

  return (
    <>
      <div className="campTabHead">
        <div>
          <h3 className="campTabHeadTitle">Call Tags</h3>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Categorize calls with reusable tags for better reporting.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ fontSize: 13, padding: '8px 14px' }}
          onClick={() => { resetModal(); setModalOpen(true) }}
        >
          <Plus size={15} /> Add Tag
        </button>
      </div>

      {campaign.callTags.length === 0 ? (
        <div className="campEmpty">No call tags defined.</div>
      ) : (
        campaign.callTags.map((t) => (
          <div key={t.id} className="campTagRow">
            <span className="campTagBadge" style={{ background: t.color }}>
              {t.label}
            </span>
            <span className="campTagDesc">{t.description}</span>
            <div className="campTagActions">
              <button type="button" className="btn-outline" style={{ fontSize: 12, padding: '6px 10px' }}>
                Edit
              </button>
              <button type="button" className="campBtnDanger" onClick={() => handleRemove(t.id)}>
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {/* ── Add Tag Modal ── */}
      {modalOpen && (
        <div
          className="campModalOverlay"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="campTagModal" role="dialog" aria-modal="true">
            <div className="campTagModalHead">
              <div>
                <h2 className="campTagModalTitle">Add Call Tag</h2>
                <p className="campTagModalSub">
                  Provide a name and optional description to organize calls for this campaign.
                </p>
              </div>
              <button
                type="button"
                className="campModalClose"
                aria-label="Close"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tag Name */}
            <div className="campFieldGroup">
              <label className="campFieldLabel" htmlFor="tag-name">
                Tag Name<span style={{ color: 'var(--danger-fg)' }}>*</span>
              </label>
              <input
                id="tag-name"
                className="input-field"
                placeholder="e.g., Urgent Leads"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="campFieldGroup">
              <label className="campFieldLabel" htmlFor="tag-desc">
                Description
              </label>
              <textarea
                id="tag-desc"
                className="textarea-field"
                placeholder="Optional notes about how to use this tag"
                rows={3}
                value={tagDesc}
                onChange={(e) => setTagDesc(e.target.value)}
              />
            </div>

            {/* Color Picker */}
            <div className="campFieldGroup">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="campFieldLabel" style={{ marginBottom: 0 }}>Tag Color</span>
                <span className="campColorHex">{tagColor.toUpperCase()}</span>
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-secondary)' }}>
                Choose a palette that pops on both light and dark backgrounds.
              </p>
              <div className="campColorGrid">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`campColorSwatch ${tagColor === c ? 'campColorSwatchActive' : ''}`}
                    style={{ background: c }}
                    onClick={() => setTagColor(c)}
                    aria-label={c}
                  >
                    {tagColor === c && <CheckCircle size={18} color="#fff" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="campFieldGroup">
              <span className="campFieldLabel">Live Preview</span>
              <div className="campPreviewRow">
                <div className="campPreviewBox campPreviewLight">
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>LIGHT</span>
                  <span className="campTagBadge" style={{ background: tagColor }}>
                    {tagName || 'SAMPLE TAG'}
                  </span>
                </div>
                <div className="campPreviewBox campPreviewDark">
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>DARK</span>
                  <span className="campTagBadge" style={{ background: tagColor }}>
                    {tagName || 'SAMPLE TAG'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="campModalFooter">
              <button
                type="button"
                className="campModalFooterLink"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!tagName.trim()}
                onClick={handleAdd}
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ────────────────────────────────────────────────────
   Contacts Tab
   ──────────────────────────────────────────────────── */

function ContactsTab({ campaign }: { campaign: Campaign }) {
  return (
    <>
      <div className="campTabHead">
        <h3 className="campTabHeadTitle">Upload Contacts</h3>
      </div>

      <div className="campUploadRow">
        <button type="button" className="btn-ghost">
          <Download size={15} /> Download sample CSV
        </button>
        <button type="button" className="btn-primary" style={{ fontSize: 13, padding: '8px 14px' }}>
          <Upload size={15} /> Upload CSV
        </button>
      </div>

      <div className="campCsvInfo">
        <p className="campCsvInfoTitle">CSV Format Requirements</p>
        <p className="campCsvInfoDesc">
          Your CSV should include headers: <strong>phone</strong>,{' '}
          <strong>person_name</strong>
        </p>
      </div>

      {campaign.contacts.length > 0 && (
        <>
          <p className="campRecentTitle">Recent Uploads</p>
          <div className="campContactList">
            {campaign.contacts.map((c) => (
              <div key={c.id} className="campContactItem">
                <span className="campContactStatus">
                  <CheckCircle
                    size={16}
                    strokeWidth={2}
                    color={
                      c.status === 'success'
                        ? 'var(--success-solid)'
                        : 'var(--danger-fg)'
                    }
                  />
                </span>
                <span className="campContactName">{c.filename}</span>
                <span className="campContactDate">{c.uploadedAt}</span>
                <button type="button" className="campContactDownload" aria-label="Download">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {campaign.contacts.length === 0 && (
        <div className="campEmpty">No contacts uploaded yet.</div>
      )}
    </>
  )
}

/* ────────────────────────────────────────────────────
   Queue Tab
   ──────────────────────────────────────────────────── */

function QueueTab({ campaign }: { campaign: Campaign }) {
  return (
    <>
      {/* Header */}
      <div className="campQueueHead">
        <h3 className="campQueueTitle">Queue Status</h3>
        <button type="button" className="btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <p className="campQueueSub">Auto-refreshes every 30s</p>

      {/* Distribution */}
        <div className="campQueueDistCard">
        <div className="campQueueDistHead">
          <span className="campQueueDistTitle">Total Queue Distribution</span>
          <span className="campQueueDistTotal">
            {campaign.totalQueued} total
          </span>
        </div>
        <div className="campQueueBar" aria-hidden>
          <div
            className="campQueueBarFill"
            style={{
              width:
                campaign.totalQueued > 0
                  ? '100%'
                  : '0%',
            }}
          />
        </div>
        {campaign.totalQueued > 0 ? (
          <div className="campQueueLegend">
            <span>
              Normal Queue: <strong>{campaign.totalQueued}</strong>
            </span>
            <span>
              Callbacks: <strong>0</strong>
            </span>
            <span>
              Not Picked: <strong>0</strong>
            </span>
          </div>
        ) : null}
        <p className="campQueueBarLabel">
          {campaign.totalQueued === 0
            ? 'All queues are empty'
            : `${campaign.totalQueued} queued`}
        </p>
      </div>

      {/* Stats */}
      <div className="campQueueStats">
        <div className="campQueueStatBox">
          <div className="campQueueStatIcon">
            <Zap size={14} />
          </div>
          <p className="campQueueStatVal">{campaign.queueBuffer}</p>
          <p className="campQueueStatLabel">Buffer</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
            Contacts actively being dialed
          </p>
        </div>
        <div className="campQueueStatBox">
          <div className="campQueueStatIcon">
            <Users size={14} />
          </div>
          <p className="campQueueStatVal">{campaign.workersRunning}</p>
          <p className="campQueueStatLabel">Workers Running</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
            of {campaign.agents.length} agents
          </p>
        </div>
        <div className="campQueueStatBox">
          <div className="campQueueStatIcon">
            <CircleDot size={14} />
          </div>
          <p className="campQueueStatVal">{campaign.totalQueued}</p>
          <p className="campQueueStatLabel">Total Queued</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
            All pending calls
          </p>
        </div>
      </div>

      {/* Queue Actions */}
      <p className="campQueueActionsTitle">
        Queue Actions (All Agents)
      </p>
      <div className="campQueueActions">
        <button type="button" className="campQueueAction">
          <div className="campQueueActionIcon campQueueActionIconRed">
            <Trash2 size={16} />
          </div>
          <p className="campQueueActionTitle">Clear All Queues</p>
          <p className="campQueueActionDesc">
            Remove all pending calls, callbacks, and not-picked retries
          </p>
        </button>
        <button type="button" className="campQueueAction">
          <div className="campQueueActionIcon campQueueActionIconBlue">
            <CircleDot size={16} />
          </div>
          <p className="campQueueActionTitle">Clear Normal Queue</p>
          <p className="campQueueActionDesc">
            Remove contacts waiting in the standard call queue
          </p>
        </button>
        <button type="button" className="campQueueAction">
          <div className="campQueueActionIcon campQueueActionIconGreen">
            <RefreshCw size={16} />
          </div>
          <p className="campQueueActionTitle">Clear Callbacks</p>
          <p className="campQueueActionDesc">
            Cancel all scheduled follow-up callback calls
          </p>
        </button>
        <button type="button" className="campQueueAction">
          <div className="campQueueActionIcon campQueueActionIconOrange">
            <PhoneOff size={16} />
          </div>
          <p className="campQueueActionTitle">Clear Not-Picked</p>
          <p className="campQueueActionDesc">
            Stop retrying contacts who didn't answer
          </p>
        </button>
      </div>

      {/* Per-Agent Breakdown */}
      <p className="campBreakdownTitle">
        Per-Agent Breakdown ({campaign.agents.length} Agent{campaign.agents.length !== 1 ? 's' : ''})
      </p>
      {campaign.agents.length === 0 ? (
        <div className="campEmpty">No agents assigned.</div>
      ) : (
        campaign.agents.map((a) => (
          <div key={a.id} className="campBreakdownRow">
            <ChevronRight size={14} color="var(--text-secondary)" />
            <span
              className="campBreakdownDot"
              style={{
                background:
                  a.status === 'active'
                    ? 'var(--success-solid)'
                    : 'var(--text-secondary)',
              }}
            />
            <span className="campBreakdownName">{a.name}</span>
            <span className="campBreakdownBadge">
              {a.status === 'active' ? 'Running' : 'Stopped'}
            </span>
            <span className="campBreakdownStatus">empty</span>
          </div>
        ))
      )}
    </>
  )
}
