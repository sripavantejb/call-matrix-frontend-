import { Bot, Calendar, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NewAgentModal } from '../../components/agents/NewAgentModal'
import '../../components/agents/agents.css'
import { useAgents } from '../../hooks/useAgents'

export function AgentsListPage() {
  const { agents, addAgent } = useAgents()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return agents
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(s) ||
        a.type.toLowerCase().includes(s),
    )
  }, [agents, q])

  const total = agents.length
  const active = agents.filter((a) => a.status === 'active').length
  const thisMonth = agents.length

  return (
    <>
      <div className="agentsPageHeader">
        <div>
          <h1 className="agentsPageTitle">Call agents</h1>
          <p className="agentsPageSub">
            Manage your AI call agents and their configurations
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={18} strokeWidth={2} aria-hidden />
          New agent
        </button>
      </div>

      <div className="agentsStatRow">
        <div className="agentsStatCard">
          <div className="agentsStatIcon" aria-hidden>
            <Bot size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Total agents</p>
            <p className="agentsStatValue">{total}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon" aria-hidden>
            <Bot size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Active</p>
            <p className="agentsStatValue">{active}</p>
          </div>
        </div>
        <div className="agentsStatCard">
          <div className="agentsStatIcon" aria-hidden>
            <Calendar size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">This month</p>
            <p className="agentsStatValue">{thisMonth}</p>
          </div>
        </div>
      </div>

      <div className="agentsSearchCard">
        <Search size={20} strokeWidth={1.75} color="var(--text-secondary)" aria-hidden />
        <input
          type="search"
          placeholder="Search agents"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search agents"
        />
      </div>

      <div className="agentsTableCard">
        <h2 className="agentsTableTitle">All agents</h2>
        <div className="tableScroll">
        <table className="agentsTable agentsTable--mobileCards">
          <thead>
            <tr>
              <th>Agent name</th>
              <th>Agent type</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.id}
                onClick={() => navigate(`/agents/${a.id}/agent`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/agents/${a.id}/agent`)
                  }
                }}
                tabIndex={0}
                role="link"
              >
                <td data-label="Agent name">
                  <span className="agentsCellName">
                    <Bot size={18} strokeWidth={1.75} color="var(--text-secondary)" aria-hidden />
                    {a.name}
                  </span>
                </td>
                <td data-label="Agent type">
                  <span className="pill-muted">{a.type}</span>
                </td>
                <td className="agentsCellMuted" data-label="Created">
                  {a.created}
                </td>
                <td data-label="Actions">
                  <div
                    className="tableActions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => {}}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => {}}
                    >
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <NewAgentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(payload) => {
          const created = addAgent(payload)
          navigate(`/agents/${created.id}/agent`)
        }}
      />
    </>
  )
}
