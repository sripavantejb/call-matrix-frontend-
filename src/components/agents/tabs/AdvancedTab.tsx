import { Bot, Database, Hexagon, Plus, Settings } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAgents } from '../../../hooks/useAgents'
import { LlmConfigModal } from '../LlmConfigModal'
import '../agents.css'

export function AdvancedTab() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getAgent, updateAgent } = useAgents()
  const agent = agentId ? getAgent(agentId) : undefined
  const [conc, setConc] = useState(() => agent?.advanced.concurrentCalls ?? 0)
  const [saved, setSaved] = useState(false)
  const [llmModalOpen, setLlmModalOpen] = useState(false)

  if (!agent) return null

  const adv = agent.advanced

  return (
    <div className="advancedSection">
      <section className="advancedCard">
        <div className="advancedCardHead">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bot size={20} strokeWidth={1.75} aria-hidden />
            <div>
              <h2 className="panelCardTitle" style={{ margin: 0 }}>
                AI Providers
              </h2>
              <p className="panelCardSub" style={{ margin: 0 }}>
                LLM, STT and TTS configuration
              </p>
            </div>
          </div>
        </div>
        <div className="advancedGrid3">
          {(
            [
              { key: 'llm' as const, label: 'LLM provider' },
              { key: 'stt' as const, label: 'STT provider (speech-to-text)' },
              { key: 'tts' as const, label: 'TTS provider (text-to-speech)' },
            ]
          ).map(({ key, label }) => (
            <div key={key}>
              <label className="fieldLabel">{label}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="selectField"
                  style={{ flex: 1 }}
                  value={adv[key]}
                  onChange={(e) =>
                    updateAgent(agent.id, {
                      advanced: { ...adv, [key]: e.target.value },
                    })
                  }
                >
                  <option value="gemini">gemini</option>
                  <option value="sarvam">sarvam</option>
                  <option value="cartesia">cartesia</option>
                </select>
                <button
                  type="button"
                  className="iconBtn"
                  aria-label={`${label} settings`}
                  onClick={() => {
                    if (key === 'llm') setLlmModalOpen(true)
                  }}
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="advancedCard">
        <div className="advancedCardHead">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Database size={20} strokeWidth={1.75} aria-hidden />
            <h2 className="panelCardTitle" style={{ margin: 0 }}>
              Knowledge Base
            </h2>
          </div>
          <button type="button" className="btn-primary">
            Configure RAG
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select className="selectField" style={{ flex: 1, minWidth: 200 }} defaultValue="">
            <option value="">No documents available</option>
          </select>
          <button type="button" className="btn-primary">
            <Plus size={16} aria-hidden />
            Add
          </button>
        </div>
      </section>

      <section className="advancedCard">
        <div className="advancedCardHead">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Hexagon size={20} strokeWidth={1.75} aria-hidden />
            <h2 className="panelCardTitle" style={{ margin: 0 }}>
              Concurrency
            </h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Concurrent calls</span>
          <div className="stepper">
            <button
              type="button"
              aria-label="Decrease"
              onClick={() => setConc((c) => Math.max(0, c - 1))}
            >
              −
            </button>
            <input
              readOnly
              value={conc}
              aria-label="Concurrent calls value"
            />
            <button
              type="button"
              aria-label="Increase"
              onClick={() => setConc((c) => c + 1)}
            >
              +
            </button>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>(no calls)</span>
          <button
            type="button"
            className="btn-primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => {
              updateAgent(agent.id, { advanced: { ...adv, concurrentCalls: conc } })
              setSaved(true)
              window.setTimeout(() => setSaved(false), 2000)
            }}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </section>

      <LlmConfigModal
        open={llmModalOpen}
        onClose={() => setLlmModalOpen(false)}
        provider={adv.llm}
        model={adv.llmModel}
        temperature={adv.llmTemperature}
        maxTokens={adv.llmMaxTokens}
        onSave={({ model, temperature, maxTokens }) => {
          updateAgent(agent.id, {
            advanced: {
              ...adv,
              llmModel: model,
              llmTemperature: temperature,
              llmMaxTokens: maxTokens,
            },
          })
        }}
      />
    </div>
  )
}
