import { Info } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import {
  TOOL_MODAL_TITLES,
  type AgentTool,
} from '../../../types/agentTools'
import { SliderField } from '../ui/SliderField'
import { ToggleRow } from '../ui/ToggleRow'
import '../agents.css'

type AgentToolModalProps = {
  open: boolean
  tool: AgentTool | null
  onClose: () => void
  onSave: (tool: AgentTool) => void
}

export function AgentToolModal({
  open,
  tool,
  onClose,
  onSave,
}: AgentToolModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !tool) return null

  return (
    <AgentToolFormInner
      key={tool.id}
      tool={tool}
      onClose={onClose}
      onSave={onSave}
    />
  )
}

function AgentToolFormInner({
  tool,
  onClose,
  onSave,
}: {
  tool: AgentTool
  onClose: () => void
  onSave: (tool: AgentTool) => void
}) {
  const titleId = useId()
  const [f, setF] = useState<AgentTool>(() => ({ ...tool }))

  const kind = f.kind
  const title = TOOL_MODAL_TITLES[kind]

  const patch = (p: Partial<AgentTool>) => setF((prev) => (prev ? { ...prev, ...p } : prev))

  function handleSave() {
    let out = { ...f }
    if (out.kind === 'custom_tool' && !out.name.trim()) {
      out = { ...out, name: 'custom_function' }
    }
    onSave(out)
    onClose()
  }

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`modalPanel${kind === 'custom_tool' ? ' modalPanelXl' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={
          kind === 'custom_tool'
            ? { maxWidth: 720, width: '100%' }
            : { maxWidth: 520, width: '100%' }
        }
      >
        <div className="modalHeader">
          <h2 id={titleId} className="modalTitle">
            {title}
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

        <div className="toolModalBody">
          <div style={{ marginBottom: 16 }}>
            <label className="fieldLabel" htmlFor="tool-name">
              Name
            </label>
            <input
              id="tool-name"
              className={`input-field${kind === 'custom_tool' ? '' : ' toolModalSlugField'}`}
              value={f.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder={
                kind === 'custom_tool'
                  ? 'Enter the name of the custom function'
                  : undefined
              }
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="fieldLabel" htmlFor="tool-desc">
              {kind === 'custom_tool' ? 'Description' : 'Description (Optional)'}
            </label>
            <textarea
              id="tool-desc"
              className="textarea-field"
              rows={
                kind === 'end_call'
                  ? 7
                  : kind === 'detect_voice_mail' || kind === 'language_switch'
                    ? 6
                    : 5
              }
              value={f.description}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder={
                kind === 'custom_tool'
                  ? 'Enter the description of the custom function'
                  : undefined
              }
            />
          </div>

          {(kind === 'transfer_call_to_human' || kind === 'warm_transfer_to_human') && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className="fieldLabel" htmlFor="tool-phone">
                  Phone number
                </label>
                <input
                  id="tool-phone"
                  className="input-field"
                  value={f.phone ?? ''}
                  onChange={(e) => patch({ phone: e.target.value })}
                  placeholder="+91 1234567890"
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="fieldLabel" htmlFor="tool-participant">
                  Participant name
                </label>
                <input
                  id="tool-participant"
                  className="input-field"
                  value={f.participantName ?? ''}
                  onChange={(e) => patch({ participantName: e.target.value })}
                />
              </div>
              {kind === 'warm_transfer_to_human' ? (
                <div style={{ marginBottom: 16 }}>
                  <label className="fieldLabel" htmlFor="tool-summary">
                    Summary instructions
                  </label>
                  <textarea
                    id="tool-summary"
                    className="textarea-field"
                    rows={4}
                    value={f.summaryInstructions ?? ''}
                    onChange={(e) => patch({ summaryInstructions: e.target.value })}
                  />
                </div>
              ) : null}
              <div style={{ marginBottom: 16 }}>
                <ToggleRow
                  label="Use call transfer static message"
                  checked={!!f.useCallTransferStaticMessage}
                  onChange={(v) => patch({ useCallTransferStaticMessage: v })}
                  id="toggle-transfer-static"
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="fieldLabel" htmlFor="tool-transfer-msg">
                  Transfer message
                </label>
                <textarea
                  id="tool-transfer-msg"
                  className="textarea-field"
                  rows={3}
                  value={f.transferMessage ?? ''}
                  onChange={(e) => patch({ transferMessage: e.target.value })}
                />
              </div>
            </>
          )}

          {kind === 'end_call' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <ToggleRow
                  label="Use end call static message"
                  checked={!!f.useEndCallStaticMessage}
                  onChange={(v) => patch({ useEndCallStaticMessage: v })}
                  id="toggle-end-static"
                  infoTip="When enabled, the agent speaks the static message below before the call ends."
                />
              </div>
              {f.useEndCallStaticMessage ? (
                <div style={{ marginBottom: 8 }}>
                  <FieldLabelWithHint
                    id="tool-end-msg"
                    hint="Text spoken to the caller before hanging up when using a static end-call message."
                  >
                    End call message
                  </FieldLabelWithHint>
                  <textarea
                    id="tool-end-msg"
                    className="textarea-field"
                    rows={3}
                    value={f.endCallMessage ?? ''}
                    onChange={(e) => patch({ endCallMessage: e.target.value })}
                  />
                </div>
              ) : null}
            </>
          )}

          {kind === 'search_rag' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="fieldLabel" htmlFor="rag-char">
                    Character limit
                  </label>
                  <input
                    id="rag-char"
                    type="number"
                    className="input-field"
                    value={f.characterLimit ?? 50000}
                    onChange={(e) =>
                      patch({ characterLimit: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="fieldLabel" htmlFor="rag-chunk">
                    Chunk limit
                  </label>
                  <input
                    id="rag-chunk"
                    type="number"
                    className="input-field"
                    value={f.chunkLimit ?? 20}
                    onChange={(e) => patch({ chunkLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <SliderField
                  label="Vector distance limit"
                  valueLabel={(f.vectorDistance ?? 0.3).toFixed(2)}
                  min={0}
                  max={1}
                  step={0.01}
                  value={f.vectorDistance ?? 0.3}
                  onChange={(v) => patch({ vectorDistance: v })}
                  minLabel="More similar"
                  maxLabel="Less similar"
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <ToggleRow
                  label="Use static RAG search message"
                  checked={!!f.useStaticRagSearchMessage}
                  onChange={(v) => patch({ useStaticRagSearchMessage: v })}
                  id="toggle-rag-static"
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="fieldLabel" htmlFor="rag-static-msg">
                  Static RAG search message
                </label>
                <textarea
                  id="rag-static-msg"
                  className="textarea-field"
                  rows={3}
                  value={f.staticRagSearchMessage ?? ''}
                  onChange={(e) => patch({ staticRagSearchMessage: e.target.value })}
                />
              </div>
            </>
          )}

          {kind === 'custom_tool' && (
            <CustomToolFields f={f} patch={patch} />
          )}
        </div>

        <div className="modalFooter" style={{ justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldLabelWithHint({
  id,
  hint,
  children,
}: {
  id?: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="fieldLabelWithHint">
      <label className="fieldLabel" htmlFor={id} style={{ margin: 0 }}>
        {children}
      </label>
      <span className="fieldLabelHintIcon" title={hint} aria-label={hint}>
        <Info size={14} strokeWidth={2} aria-hidden />
      </span>
    </div>
  )
}

function CustomToolFields({
  f,
  patch,
}: {
  f: AgentTool
  patch: (p: Partial<AgentTool>) => void
}) {
  const headers = f.headers ?? [{ key: '', value: '' }]
  const queryParams = f.queryParams ?? [{ key: '', value: '' }]

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <label className="fieldLabel">API endpoint</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="selectField"
            style={{ width: 100 }}
            value={f.apiMethod ?? 'POST'}
            onChange={(e) => patch({ apiMethod: e.target.value })}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            className="input-field"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="Enter the URL of the custom function"
            value={f.apiUrl ?? ''}
            onChange={(e) => patch({ apiUrl: e.target.value })}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0' }}>
          The API endpoint is the address of the service you are connecting to.
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="fieldLabel">Timeout (ms)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              patch({ timeoutMs: (f.timeoutMs ?? 120000) + 1000 })
            }
          >
            +1000
          </button>
          <input
            type="number"
            className="input-field"
            style={{ width: 120 }}
            value={f.timeoutMs ?? 120000}
            onChange={(e) => patch({ timeoutMs: Number(e.target.value) })}
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              patch({
                timeoutMs: Math.max(0, (f.timeoutMs ?? 120000) - 1000),
              })
            }
          >
            −1000
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>milliseconds</span>
        </div>
      </div>

      <KeyBlock
        title="Headers"
        hint="Specify the HTTP headers required for your API request."
        pairs={headers}
        onChange={(next) => patch({ headers: next })}
      />
      <KeyBlock
        title="Query parameters"
        hint="Query string parameters to append to the URL."
        pairs={queryParams}
        onChange={(next) => patch({ queryParams: next })}
      />

      <div style={{ marginBottom: 16 }}>
        <ToggleRow
          label="Payload: args only"
          checked={!!f.payloadArgsOnly}
          onChange={(v) => patch({ payloadArgsOnly: v })}
          id="toggle-payload-args"
        />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Send only the args payload to your custom function
        </p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span className="fieldLabel">Payload type</span>
        <div className="segmented" style={{ marginTop: 8 }}>
          <button
            type="button"
            className={`segmentBtn${f.payloadFormat === 'json' ? ' segmentBtnActive' : ''}`}
            onClick={() => patch({ payloadFormat: 'json' })}
          >
            JSON
          </button>
          <button
            type="button"
            className={`segmentBtn${f.payloadFormat === 'form' ? ' segmentBtnActive' : ''}`}
            onClick={() => patch({ payloadFormat: 'form' })}
          >
            Form
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label className="fieldLabel" htmlFor="tool-payload">
          Payload
        </label>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 8px' }}>
          JSON payload to send with the request.
        </p>
        <textarea
          id="tool-payload"
          className="textarea-field"
          rows={6}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
          value={f.payloadJson ?? ''}
          onChange={(e) => patch({ payloadJson: e.target.value })}
        />
      </div>
    </>
  )
}

function KeyBlock({
  title,
  hint,
  pairs,
  onChange,
}: {
  title: string
  hint: string
  pairs: { key: string; value: string }[]
  onChange: (next: { key: string; value: string }[]) => void
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14 }}>{title}</p>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 8px' }}>{hint}</p>
      {pairs.map((row, i) => (
        <div
          key={i}
          style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}
        >
          <input
            className="input-field"
            placeholder="Key"
            value={row.key}
            onChange={(e) => {
              const next = [...pairs]
              next[i] = { ...row, key: e.target.value }
              onChange(next)
            }}
          />
          <input
            className="input-field"
            placeholder="Value"
            value={row.value}
            onChange={(e) => {
              const next = [...pairs]
              next[i] = { ...row, value: e.target.value }
              onChange(next)
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn-primary"
        style={{ width: '100%', marginTop: 4 }}
        onClick={() => onChange([...pairs, { key: '', value: '' }])}
      >
        + New key value pair
      </button>
    </div>
  )
}
