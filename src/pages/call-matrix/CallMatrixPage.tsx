import {
  Calendar,
  Download,
  Filter,
  Phone,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DateRangeModal } from '../../components/call-matrix/DateRangeModal'
import '../../components/agents/agents.css'
import '../../components/call-matrix/call-matrix.css'
import {
  type ConversationRow,
  type ConversationStatus,
  distinctAgents,
  distinctCampaigns,
  isWithinRange,
  MOCK_CONVERSATIONS,
} from '../../data/callMatrixMock'
import {
  formatRangeButtonLabel,
  rangeLastNDays,
  type DatePresetId,
} from '../../components/call-matrix/dateRangePresets'
import { downloadConversationsCsv } from '../../utils/csv'

const PAGE_SIZE = 10

const STATUS_OPTIONS: { value: '' | ConversationStatus; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'picked', label: 'Picked' },
  { value: 'not_picked', label: 'Not Picked' },
  { value: 'failed', label: 'Failed' },
  { value: 'busy', label: 'Busy' },
  { value: 'voicemail', label: 'Voicemail' },
  { value: 'in_progress', label: 'In Progress' },
]

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function statusPillClass(status: ConversationStatus): string {
  const map: Record<ConversationStatus, string> = {
    picked: 'cmStatusPicked',
    not_picked: 'cmStatusNotPicked',
    busy: 'cmStatusBusy',
    voicemail: 'cmStatusVoicemail',
    failed: 'cmStatusFailed',
    in_progress: 'cmStatusInProgress',
  }
  return map[status]
}

function statusLabel(status: ConversationStatus): string {
  const map: Record<ConversationStatus, string> = {
    picked: 'Picked',
    not_picked: 'Not Picked',
    busy: 'Busy',
    voicemail: 'Voicemail',
    failed: 'Failed',
    in_progress: 'In Progress',
  }
  return map[status]
}

export function CallMatrixPage() {
  const initialRange = useMemo(() => rangeLastNDays(7), [])
  const [dateFrom, setDateFrom] = useState(initialRange.from)
  const [dateTo, setDateTo] = useState(initialRange.to)
  const [datePreset, setDatePreset] = useState<DatePresetId | null>('last7')
  const [dateModalOpen, setDateModalOpen] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [appliedPhoneQuery, setAppliedPhoneQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'' | ConversationStatus>('')
  const [filterAgent, setFilterAgent] = useState('')
  const [filterCampaign, setFilterCampaign] = useState('')
  const [filterCallType, setFilterCallType] = useState<'' | 'inbound' | 'outbound'>('')

  const [page, setPage] = useState(1)

  const agents = useMemo(() => distinctAgents(MOCK_CONVERSATIONS), [])
  const campaigns = useMemo(() => distinctCampaigns(MOCK_CONVERSATIONS), [])

  const inDateRange = useMemo(
    () =>
      MOCK_CONVERSATIONS.filter((r) =>
        isWithinRange(r.startedAt, dateFrom, dateTo),
      ),
    [dateFrom, dateTo],
  )

  const metrics = useMemo(() => {
    const rows = inDateRange
    const total = rows.length
    const count = (s: ConversationStatus) =>
      rows.filter((r) => r.status === s).length
    return {
      total,
      picked: count('picked'),
      notPicked: count('not_picked'),
      busy: count('busy'),
      voicemail: count('voicemail'),
      failed: count('failed'),
    }
  }, [inDateRange])

  const filtered = useMemo(() => {
    let rows: ConversationRow[] = inDateRange
    const q = appliedPhoneQuery.trim().replace(/\s/g, '')
    if (q) {
      rows = rows.filter((r) =>
        r.phone.replace(/\s/g, '').toLowerCase().includes(q.toLowerCase()),
      )
    }
    if (filterStatus) {
      rows = rows.filter((r) => r.status === filterStatus)
    }
    if (filterAgent) {
      rows = rows.filter((r) => r.agent === filterAgent)
    }
    if (filterCampaign) {
      rows = rows.filter((r) => r.campaign === filterCampaign)
    }
    if (filterCallType) {
      rows = rows.filter((r) => r.callType === filterCallType)
    }
    return rows
  }, [
    inDateRange,
    appliedPhoneQuery,
    filterStatus,
    filterAgent,
    filterCampaign,
    filterCallType,
  ])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const currentPage = Math.min(page, totalPages)
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  const dateButtonLabel = formatRangeButtonLabel(dateFrom, dateTo, datePreset)

  return (
    <>
      <div className="agentsPageHeader">
        <div>
          <h1 className="agentsPageTitle">Call matrix</h1>
          <p className="agentsPageSub">
            View and analyze all call transcripts and recordings.
          </p>
        </div>
        <div className="cmHeaderActions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setDateModalOpen(true)}
          >
            <Calendar size={18} strokeWidth={1.75} aria-hidden />
            {dateButtonLabel}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => downloadConversationsCsv(filtered)}
          >
            <Download size={18} strokeWidth={2} aria-hidden />
            Export
          </button>
        </div>
      </div>

      <div className="cmMetricGrid">
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconBlue" aria-hidden>
            <Phone size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Total</p>
            <p className="agentsStatValue">{metrics.total}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconGreen" aria-hidden>
            <Phone size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Picked</p>
            <p className="agentsStatValue">{metrics.picked}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconOrange" aria-hidden>
            <Phone size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Not picked</p>
            <p className="agentsStatValue">{metrics.notPicked}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconTeal" aria-hidden>
            <Phone size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Busy</p>
            <p className="agentsStatValue">{metrics.busy}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconPurple" aria-hidden>
            <Phone size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Voicemail</p>
            <p className="agentsStatValue">{metrics.voicemail}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconRed" aria-hidden>
            <Phone size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Failed</p>
            <p className="agentsStatValue">{metrics.failed}</p>
          </div>
        </div>
      </div>

      <div className="cmToolbarRow">
        <div className="agentsSearchCard">
          <Search size={20} strokeWidth={1.75} color="var(--text-secondary)" aria-hidden />
          <input
            type="search"
            placeholder="Search by phone number..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setAppliedPhoneQuery(searchInput)
                setPage(1)
              }
            }}
            aria-label="Search by phone number"
          />
        </div>
        <button
          type="button"
          className="iconButton"
          aria-label="Clear search"
          title="Clear search"
          onClick={() => {
            setSearchInput('')
            setAppliedPhoneQuery('')
            setPage(1)
          }}
        >
          <RefreshCw size={20} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setAppliedPhoneQuery(searchInput)
            setPage(1)
          }}
        >
          Search
        </button>
        <button
          type="button"
          className={`btn-outline${filtersOpen ? ' cmFilterActive' : ''}`}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          <Filter size={18} strokeWidth={1.75} aria-hidden />
          Filters
        </button>
        <span className="cmToolbarMeta">
          {filtered.length} conversation{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {filtersOpen && (
        <div className="cmFiltersPanel">
          <h2 className="cmFiltersTitle">Filters</h2>
          <div className="cmFiltersGrid">
            <div>
              <label className="cmFieldLabel" htmlFor="cm-filter-status">
                Status
              </label>
              <select
                id="cm-filter-status"
                className="selectField"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as '' | ConversationStatus)
                  setPage(1)
                }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="cmFieldLabel" htmlFor="cm-filter-agent">
                Agent
              </label>
              <select
                id="cm-filter-agent"
                className="selectField"
                value={filterAgent}
                onChange={(e) => {
                  setFilterAgent(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All Agents</option>
                {agents.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="cmFieldLabel" htmlFor="cm-filter-campaign">
                Campaign
              </label>
              <select
                id="cm-filter-campaign"
                className="selectField"
                value={filterCampaign}
                onChange={(e) => {
                  setFilterCampaign(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All Campaign</option>
                {campaigns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="cmFieldLabel" htmlFor="cm-filter-calltype">
                Call Type
              </label>
              <select
                id="cm-filter-calltype"
                className="selectField"
                value={filterCallType}
                onChange={(e) => {
                  setFilterCallType(e.target.value as '' | 'inbound' | 'outbound')
                  setPage(1)
                }}
              >
                <option value="">All Call Types</option>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="agentsTableCard">
        <h2 className="agentsTableTitle">All Conversations</h2>
        <div className="cmTableWrap tableScroll">
          <table className="agentsTable agentsTable--mobileCards">
            <thead>
              <tr>
                <th>Date &amp; time</th>
                <th>Phone number</th>
                <th>Agent</th>
                <th>Tag</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="cmEmptyCell">
                    No conversations match your filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Date & time">
                      <div className="cmCellDatePrimary">
                        {r.startedAt.toLocaleDateString()}
                      </div>
                      <div className="cmCellDateSecondary">
                        {r.startedAt.toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td data-label="Phone number">
                      <span className="cmPhoneCell">
                        <Phone size={16} strokeWidth={1.75} color="#16a34a" aria-hidden />
                        {r.phone}
                      </span>
                    </td>
                    <td data-label="Agent">{r.agent}</td>
                    <td className="agentsCellMuted" data-label="Tag">
                      {r.tags ?? '—'}
                    </td>
                    <td data-label="Duration">{formatDuration(r.durationSec)}</td>
                    <td data-label="Status">
                      <span className={`cmStatusPill ${statusPillClass(r.status)}`}>
                        {statusLabel(r.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="cmPagination">
            <button
              type="button"
              className="btn-outline"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="cmPaginationInfo">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <DateRangeModal
        open={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        appliedFrom={dateFrom}
        appliedTo={dateTo}
        appliedPreset={datePreset}
        onApply={(from, to, preset) => {
          setDateFrom(from)
          setDateTo(to)
          setDatePreset(preset)
          setPage(1)
        }}
      />
    </>
  )
}
