import {
  Hash,
  Info,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import '../../components/agents/agents.css'
import '../../components/call-matrix/call-matrix.css'
import {
  MOCK_PHONE_NUMBERS,
  type PhoneNumberCapability,
  type PhoneNumberRow,
} from '../../data/phoneNumbersMock'
import './phone-numbers.css'

type Segment = 'all' | 'inbound' | 'outbound'

function formatAdded(d: Date) {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function rowMatchesSegment(row: PhoneNumberRow, segment: Segment): boolean {
  if (segment === 'all') return true
  return row.types.includes(segment)
}

function searchMatches(row: PhoneNumberRow, q: string): boolean {
  if (!q) return true
  const s = q.trim().toLowerCase()
  return (
    row.phone.toLowerCase().includes(s) ||
    row.inboundAgent.toLowerCase().includes(s) ||
    row.outboundAgent.toLowerCase().includes(s)
  )
}

export function PhoneNumbersPage() {
  const [q, setQ] = useState('')
  const [segment, setSegment] = useState<Segment>('all')

  const searched = useMemo(
    () => MOCK_PHONE_NUMBERS.filter((row) => searchMatches(row, q)),
    [q],
  )

  const metrics = useMemo(() => {
    const total = searched.length
    const inbound = searched.filter((r) => r.types.includes('inbound')).length
    const outbound = searched.filter((r) =>
      r.types.includes('outbound'),
    ).length
    return { total, inbound, outbound }
  }, [searched])

  const tableRows = useMemo(
    () => searched.filter((row) => rowMatchesSegment(row, segment)),
    [searched, segment],
  )

  return (
    <>
      <div className="agentsPageHeader">
        <div>
          <h1 className="agentsPageTitle">Phone Numbers</h1>
          <p className="agentsPageSub">
            View all SIP phone numbers assigned to your agents.
          </p>
        </div>
      </div>

      <div className="pnToolbar">
        <div className="agentsSearchCard">
          <Search size={20} strokeWidth={1.75} color="var(--text-secondary)" aria-hidden />
          <input
            type="search"
            placeholder="Search by phone number..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search by phone number"
          />
        </div>
        <div className="pnSegmentWrap" role="group" aria-label="Filter by direction">
          <div className="segmented">
            {(
              [
                ['all', 'All'],
                ['inbound', 'Inbound'],
                ['outbound', 'Outbound'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`segmentBtn${segment === value ? ' segmentBtnActive' : ''}`}
                onClick={() => setSegment(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="agentsStatRow">
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconOrange" aria-hidden>
            <Hash size={22} strokeWidth={1.75} />
          </div>
          <div>
            <div className="pnStatLabelRow">
              <p className="agentsStatLabel">Total numbers</p>
              <button
                type="button"
                className="pnStatInfo"
                title="Total SIP numbers available to your workspace."
                aria-label="Total SIP numbers available to your workspace."
              >
                <Info size={14} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <p className="agentsStatValue">{metrics.total}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconGreen" aria-hidden>
            <PhoneIncoming size={22} strokeWidth={1.75} />
          </div>
          <div>
            <div className="pnStatLabelRow">
              <p className="agentsStatLabel">Inbound</p>
              <button
                type="button"
                className="pnStatInfo"
                title="Numbers configured for inbound calls."
                aria-label="Numbers configured for inbound calls."
              >
                <Info size={14} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <p className="agentsStatValue">{metrics.inbound}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon cmStatIconBlue" aria-hidden>
            <PhoneOutgoing size={22} strokeWidth={1.75} />
          </div>
          <div>
            <div className="pnStatLabelRow">
              <p className="agentsStatLabel">Outbound</p>
              <button
                type="button"
                className="pnStatInfo"
                title="Numbers configured for outbound calls."
                aria-label="Numbers configured for outbound calls."
              >
                <Info size={14} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <p className="agentsStatValue">{metrics.outbound}</p>
          </div>
        </div>
      </div>

      <div className="agentsTableCard">
        <h2 className="agentsTableTitle">Phone Numbers</h2>
        <div className="tableScroll">
        <table className="agentsTable agentsTable--mobileCards">
          <thead>
            <tr>
              <th>Phone number</th>
              <th>Types</th>
              <th>Inbound agent</th>
              <th>Outbound agent</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="pnEmptyCell">
                  No phone numbers match your filters.
                </td>
              </tr>
            ) : (
              tableRows.map((row) => (
                <tr key={row.id}>
                  <td data-label="Phone number">
                    <div className="pnPhoneCell">
                      <span className="pnPhoneIcon" aria-hidden>
                        <Phone size={18} strokeWidth={1.75} />
                      </span>
                      <span className="pnPhoneDigits">{row.phone}</span>
                    </div>
                  </td>
                  <td data-label="Types">
                    <div className="pnTypeBadges">
                      {row.types.map((t: PhoneNumberCapability) =>
                        t === 'inbound' ? (
                          <span key={t} className="pnBadgeInbound">
                            Inbound
                          </span>
                        ) : (
                          <span key={t} className="pnBadgeOutbound">
                            Outbound
                          </span>
                        ),
                      )}
                    </div>
                  </td>
                  <td data-label="Inbound agent">{row.inboundAgent}</td>
                  <td data-label="Outbound agent">{row.outboundAgent}</td>
                  <td className="agentsCellMuted" data-label="Added">
                    {formatAdded(row.addedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}
