import { Mic, Pencil, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAgents } from '../../../hooks/useAgents'
import { createDefaultTool, type AgentTool } from '../../../types/agentTools'
import { AgentToolModal } from '../tools/AgentToolModal'
import { ToolAddMenu } from '../tools/ToolAddMenu'
import { ToggleRow } from '../ui/ToggleRow'
import '../agents.css'

function chatSeedFromFirstMessage(firstMessage: string) {
  const t = firstMessage.trim()
  if (t) return [{ id: 'seed', role: 'agent' as const, text: t }]
  return [
    {
      id: 'seed',
      role: 'agent' as const,
      text: 'నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?',
    },
  ]
}

export function AgentWorkspaceTab() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getAgent, updateAgent } = useAgents()
  const agent = agentId ? getAgent(agentId) : undefined

  const [testMode, setTestMode] = useState<'voice' | 'chat'>('voice')
  const [firstMessage, setFirstMessage] = useState(() => agent?.firstMessage ?? '')
  const [systemPrompt, setSystemPrompt] = useState(() => agent?.systemPrompt ?? '')
  const [interruptible, setInterruptible] = useState(() => agent?.interruptible ?? true)

  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [toolModalOpen, setToolModalOpen] = useState(false)
  const [toolDraft, setToolDraft] = useState<AgentTool | null>(null)

  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<
    { id: string; role: 'agent' | 'user'; text: string }[]
  >([])

  if (!agent) return null

  const saveTool = (next: AgentTool) => {
    const exists = agent.tools.some((x) => x.id === next.id)
    const tools = exists
      ? agent.tools.map((x) => (x.id === next.id ? next : x))
      : [...agent.tools, next]
    updateAgent(agent.id, { tools })
  }

  function openEdit(t: AgentTool) {
    setToolDraft({ ...t })
    setToolModalOpen(true)
  }

  function openAdd(kind: Parameters<typeof createDefaultTool>[0]) {
    const id = `t-${Date.now()}`
    setToolDraft(createDefaultTool(kind, id))
    setToolModalOpen(true)
  }

  function closeToolModal() {
    setToolModalOpen(false)
    setToolDraft(null)
  }

  function sendChatMessage() {
    const text = chatInput.trim()
    if (!text) return
    const uid = `u-${Date.now()}`
    setChatMessages((m) => [...m, { id: uid, role: 'user', text }])
    setChatInput('')
    window.setTimeout(() => {
      setChatMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: 'agent',
          text:
            'Thanks — this is a local demo reply. Connect your backend to stream real agent responses.',
        },
      ])
    }, 450)
  }

  return (
    <div className="agentWorkspace">
      <section className="panelCard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="panelCardTitle" style={{ margin: 0 }}>
            Prompts
          </h2>
          <button type="button" className="btn-primary" onClick={() => updateAgent(agent.id, { firstMessage, systemPrompt, interruptible })}>
            Save prompts
          </button>
        </div>
        <label className="fieldLabel" htmlFor="first-msg">
          First Message
        </label>
        <textarea
          id="first-msg"
          className="textarea-field"
          style={{ minHeight: 140 }}
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
        />
        <p className="panelCardSub">
          The first message the agent will say. If empty, the agent will wait for the User to start the conversation.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <ToggleRow
            label="Interruptible"
            checked={interruptible}
            onChange={(v) => setInterruptible(v)}
          />
        </div>

        <label className="fieldLabel" htmlFor="sys-prompt">
          System Prompt
        </label>
        <textarea
          id="sys-prompt"
          className="textarea-field"
          style={{ minHeight: 180 }}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
        <p className="panelCardSub">
          Define the agent&apos;s personality, behavior, and guidelines for interactions.
        </p>
      </section>

      <section className="panelCard">
        <div className="toolsHeader">
          <h2 className="panelCardTitle" style={{ margin: 0 }}>
            Tools (Optional)
          </h2>
          <div className="toolAddWrap">
            <button
              type="button"
              className="linkLike"
              aria-expanded={addMenuOpen}
              aria-haspopup="menu"
              onClick={() => setAddMenuOpen((o) => !o)}
            >
              + Add
            </button>
            <ToolAddMenu
              open={addMenuOpen}
              onClose={() => setAddMenuOpen(false)}
              onPick={(kind) => {
                openAdd(kind)
              }}
            />
          </div>
        </div>
        <p className="panelCardSub">
          Enable this agent with capabilities such as calendar bookings, call termination, or your own custom functions.
        </p>
        {agent.tools.map((t) => (
          <div key={t.id} className="toolRow">
            <span className="toolRowSlug">{t.name}</span>
            <div className="toolActions">
              <button
                type="button"
                className="iconBtn"
                aria-label={`Edit ${t.name}`}
                onClick={() => openEdit(t)}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className="iconBtn"
                aria-label={`Delete ${t.name}`}
                onClick={() =>
                  updateAgent(agent.id, {
                    tools: agent.tools.filter((x) => x.id !== t.id),
                  })
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {agent.tools.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No tools configured.</p>
        ) : null}
      </section>

      <section className="panelCard">
        <div className="segmented" role="group" aria-label="Test mode">
          <button
            type="button"
            className={`segmentBtn${testMode === 'voice' ? ' segmentBtnActive' : ''}`}
            onClick={() => setTestMode('voice')}
          >
            Voice
          </button>
          <button
            type="button"
            className={`segmentBtn${testMode === 'chat' ? ' segmentBtnActive' : ''}`}
            onClick={() => {
              setTestMode('chat')
              setChatMessages((prev) =>
                prev.length > 0 ? prev : chatSeedFromFirstMessage(firstMessage),
              )
            }}
          >
            Chat
          </button>
        </div>
        {testMode === 'voice' ? (
          <div className="testPanel">
            <Mic size={32} strokeWidth={1.5} aria-hidden />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Test your agent
            </span>
            <button type="button" className="btn-primary">
              Test
            </button>
          </div>
        ) : (
          <div className="testChatShell">
            <p className="testChatTitle">Agent</p>
            <div className="testChatThread" role="log" aria-live="polite">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`testChatBubble${m.role === 'user' ? ' testChatBubbleUser' : ' testChatBubbleAgent'}`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="testChatComposer">
              <input
                type="text"
                className="testChatInput"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendChatMessage()
                  }
                }}
                aria-label="Chat message"
              />
              <button
                type="button"
                className="testChatSend"
                aria-label="Send message"
                disabled={!chatInput.trim()}
                onClick={sendChatMessage}
              >
                <Send size={20} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        )}
      </section>

      <AgentToolModal
        open={toolModalOpen}
        tool={toolDraft}
        onClose={closeToolModal}
        onSave={saveTool}
      />
    </div>
  )
}
