import { useEffect, useId, useRef, useState } from 'react'
import type { AgentType } from '../../data/agentsMock'
import './agents.css'

type NewAgentModalProps = {
  open: boolean
  onClose: () => void
  onCreate: (payload: {
    name: string
    type: AgentType
    description: string
  }) => void
}

export function NewAgentModal({ open, onClose, onCreate }: NewAgentModalProps) {
  const titleId = useId()
  const nameRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<AgentType | null>(null)

  useEffect(() => {
    if (!open) return
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

  const nameLen = name.length
  const descLen = description.length
  const canSubmit = name.trim().length > 0 && type !== null

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
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modalHeader">
          <h2 id={titleId} className="modalTitle">
            Complete your agent
          </h2>
          <button
            type="button"
            className="modalClose"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="modalHint">
          Choose a name that reflects your agent&apos;s purpose.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label className="fieldLabel" htmlFor="agent-name-input">
            Agent Name *
          </label>
          <input
            ref={nameRef}
            id="agent-name-input"
            className="input-field"
            placeholder="Enter agent name..."
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="fieldHint">{nameLen}/50</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <span className="fieldLabel">Agent Type *</span>
          <div className="radioCards" style={{ marginTop: 8 }}>
            {(['Single Prompt', 'Multi Prompt'] as const).map((opt) => (
              <label
                key={opt}
                className={`radioCard${type === opt ? ' radioCardSelected' : ''}`}
              >
                <input
                  type="radio"
                  name="agent-type"
                  checked={type === opt}
                  onChange={() => setType(opt)}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="fieldLabel" htmlFor="agent-desc-input">
            Description
          </label>
          <textarea
            id="agent-desc-input"
            className="textarea-field"
            placeholder="Enter agent description (optional)..."
            maxLength={200}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="fieldHint">{descLen}/200</p>
        </div>

        <div className="modalFooter">
          <button
            type="button"
            className="btn-primary"
            disabled={!canSubmit}
            onClick={() => {
              if (!type) return
              onCreate({
                name: name.trim(),
                type,
                description: description.trim(),
              })
              setName('')
              setDescription('')
              setType(null)
              onClose()
            }}
          >
            Create Agent
          </button>
        </div>
      </div>
    </div>
  )
}
