import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { CampaignType } from '../../data/campaignsMock'
import './campaigns.css'

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (payload: {
    name: string
    type: CampaignType
    startTime: string
    endTime: string
    businessHoursOnly: boolean
    retryWaitMinutes: number
    maxRetries: number
  }) => void
}

const RETRY_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
] as const

export function NewCampaignModal({ open, onClose, onCreate }: Props) {
  const titleId = useId()
  const nameRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [type, setType] = useState<CampaignType>('outbound')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('18:00')
  const [bizHours, setBizHours] = useState(true)
  const [retryWait, setRetryWait] = useState(10)
  const [customRetry, setCustomRetry] = useState('')
  const [maxRetries, setMaxRetries] = useState(2)

  useEffect(() => {
    if (!open) return
    setStep(1)
    setName('')
    setType('outbound')
    setStartTime('09:00')
    setEndTime('18:00')
    setBizHours(true)
    setRetryWait(10)
    setCustomRetry('')
    setMaxRetries(2)
    const t = window.setTimeout(() => nameRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
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

  const canNext = name.trim().length > 0
  const isCustom = !RETRY_OPTIONS.some((o) => o.value === retryWait)
  const effectiveRetry = isCustom ? (Number(customRetry) || retryWait) : retryWait

  function handleLaunch() {
    onCreate({
      name: name.trim(),
      type,
      startTime,
      endTime,
      businessHoursOnly: bizHours,
      retryWaitMinutes: effectiveRetry,
      maxRetries,
    })
  }

  return (
    <div
      className="campModalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="campModalPanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Header */}
        <div className="campModalHeader">
          <h2 id={titleId} className="campModalTitle">
            Create New Campaign
          </h2>
          <button
            type="button"
            className="campModalClose"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="campSteps">
          <span
            className={`campStepCircle ${step >= 1 ? 'campStepCircleActive' : 'campStepCirclePending'}`}
          >
            {step > 1 ? <Check size={16} /> : '1'}
          </span>
          <span
            className={`campStepLine ${step > 1 ? 'campStepLineActive' : ''}`}
          />
          <span
            className={`campStepCircle ${step === 2 ? 'campStepCircleActive' : 'campStepCirclePending'}`}
          >
            2
          </span>
        </div>
        <div className="campStepLabels">
          <span className={`campStepLabel ${step === 1 ? 'campStepLabelActive' : ''}`}>
            Campaign Setup
          </span>
          <span className={`campStepLabel ${step === 2 ? 'campStepLabelActive' : ''}`}>
            Timing &amp; Launch
          </span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                margin: '20px 0 16px',
                color: 'var(--text-primary)',
              }}
            >
              Campaign Information
            </h3>
            <div className="campFieldGroup">
              <label className="campFieldLabel" htmlFor="camp-name">
                Campaign Name
              </label>
              <input
                ref={nameRef}
                id="camp-name"
                className="input-field"
                placeholder="e.g., Q1 Sales Outreach"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="campFieldGroup">
              <label className="campFieldLabel" htmlFor="camp-type">
                Campaign Type
              </label>
              <select
                id="camp-type"
                className="campSelectField"
                value={type}
                onChange={(e) => setType(e.target.value as CampaignType)}
              >
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>

            <div className="campModalFooter">
              <button
                type="button"
                className="campModalFooterLink"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!canNext}
                onClick={() => setStep(2)}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                margin: '20px 0 4px',
                color: 'var(--text-primary)',
              }}
            >
              Timing &amp; Launch
            </h3>
            <p
              style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                margin: '0 0 16px',
              }}
            >
              Set when this campaign should be active. Launch happens after your
              agent is enabled.
            </p>

            <div className="campTimeRow" style={{ marginBottom: 12 }}>
              <div>
                <label className="campFieldLabel" htmlFor="camp-start">
                  Start Time
                </label>
                <input
                  id="camp-start"
                  type="time"
                  className="input-field"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="campFieldLabel" htmlFor="camp-end">
                  End Time
                </label>
                <input
                  id="camp-end"
                  type="time"
                  className="input-field"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <label className="campCheckRow">
              <input
                type="checkbox"
                checked={bizHours}
                onChange={(e) => setBizHours(e.target.checked)}
              />
              Only call during business hours (9 AM - 6 PM)
            </label>

            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                fontWeight: 600,
                margin: '24px 0 12px',
                color: 'var(--text-primary)',
              }}
            >
              Call Retry Settings
            </h4>

            <div className="campFieldGroup">
              <span className="campFieldLabel">Retry Wait Time</span>
              <div className="campRetryPills">
                {RETRY_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={`campRetryPill ${retryWait === o.value && !isCustom ? 'campRetryPillActive' : ''}`}
                    onClick={() => {
                      setRetryWait(o.value)
                      setCustomRetry('')
                    }}
                  >
                    {o.label}
                  </button>
                ))}
                <button
                  type="button"
                  className={`campRetryPill ${isCustom ? 'campRetryPillActive' : ''}`}
                  onClick={() => {
                    setRetryWait(-1)
                    setCustomRetry('')
                  }}
                >
                  Custom
                </button>
              </div>
              {isCustom && (
                <input
                  className="input-field"
                  type="number"
                  min={1}
                  placeholder="Minutes"
                  value={customRetry}
                  onChange={(e) => setCustomRetry(e.target.value)}
                  style={{ marginTop: 10, maxWidth: 160 }}
                />
              )}
            </div>

            <div className="campFieldGroup">
              <label className="campFieldLabel" htmlFor="camp-retries">
                Maximum Retry Attempts
              </label>
              <input
                id="camp-retries"
                type="number"
                className="input-field"
                min={0}
                max={10}
                value={maxRetries}
                onChange={(e) => setMaxRetries(Number(e.target.value))}
              />
            </div>

            {/* Summary */}
            <div className="campSummary">
              <h4 className="campSummaryTitle">Campaign Summary</h4>
              <div className="campSummaryRow">
                <span className="campSummaryLabel">Campaign Name:</span>
                <span className="campSummaryValue">{name || '—'}</span>
              </div>
              <div className="campSummaryRow">
                <span className="campSummaryLabel">Type:</span>
                <span className="campSummaryValue">{type}</span>
              </div>
              <div className="campSummaryRow">
                <span className="campSummaryLabel">Start Time:</span>
                <span className="campSummaryValue">{startTime}</span>
              </div>
              <div className="campSummaryRow">
                <span className="campSummaryLabel">End Time:</span>
                <span className="campSummaryValue">{endTime}</span>
              </div>
              <div className="campSummaryRow">
                <span className="campSummaryLabel">Business Hours Only:</span>
                <span className="campSummaryValue">{bizHours ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="campModalFooter">
              <button
                type="button"
                className="campModalFooterLink"
                onClick={() => setStep(1)}
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleLaunch}
              >
                Launch Campaign
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
