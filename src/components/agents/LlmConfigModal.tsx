import { useEffect, useId, useState } from 'react'
import { SliderField } from './ui/SliderField'
import './agents.css'

const MODEL_OPTIONS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
] as const

type LlmConfigModalProps = {
  open: boolean
  onClose: () => void
  provider: string
  model: string
  temperature: number
  maxTokens: number
  onSave: (next: {
    model: string
    temperature: number
    maxTokens: number
  }) => void
}

export function LlmConfigModal({
  open,
  onClose,
  provider,
  model,
  temperature,
  maxTokens,
  onSave,
}: LlmConfigModalProps) {
  const titleId = useId()
  const [m, setM] = useState(model)
  const [temp, setTemp] = useState(temperature)
  const [tokens, setTokens] = useState(maxTokens)

  useEffect(() => {
    if (!open) return
    setM(model)
    setTemp(temperature)
    setTokens(maxTokens)
  }, [open, model, temperature, maxTokens])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modalPanel llmConfigModalPanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modalHeader">
          <h2 id={titleId} className="modalTitle">
            LLM Configuration
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

        <div className="llmConfigProviderBlock">
          <span className="fieldLabel">Provider</span>
          <div className="llmConfigProviderPill">{provider}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="fieldLabel" htmlFor="llm-model-select">
            Model
          </label>
          <select
            id="llm-model-select"
            className="selectField"
            value={m}
            onChange={(e) => setM(e.target.value)}
          >
            {MODEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <SliderField
            label="Temperature"
            valueLabel={temp.toFixed(2)}
            min={0}
            max={1}
            step={0.01}
            value={temp}
            onChange={setTemp}
            minLabel="0"
            maxLabel="1"
          />
        </div>

        <div>
          <label className="fieldLabel" htmlFor="llm-max-tokens">
            Max Tokens
          </label>
          <input
            id="llm-max-tokens"
            type="number"
            className="input-field"
            min={1}
            max={8192}
            value={tokens}
            onChange={(e) => setTokens(Number(e.target.value))}
          />
        </div>

        <div className="modalFooter llmConfigModalFooter">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onSave({ model: m, temperature: temp, maxTokens: tokens })
              onClose()
            }}
          >
            Save configuration
          </button>
        </div>
      </div>
    </div>
  )
}
