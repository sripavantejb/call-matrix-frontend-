import { ArrowLeft, Bot, Copy } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import type { AgentRecord } from '../../data/agentsMock'
import './agents.css'

type AgentDetailHeaderProps = {
  agent: AgentRecord
  agentBasePath: string
}

export function AgentDetailHeader({ agent, agentBasePath }: AgentDetailHeaderProps) {
  const statusClass =
    agent.status === 'active'
      ? 'agentStatusBadge agentStatusBadgeActive'
      : 'agentStatusBadge agentStatusBadgeInactive'

  return (
    <div className="agentDetailHeader">
      <Link to="/agents" className="agentDetailBack">
        <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
        Back to agents
      </Link>
      <div className="agentHeaderRow">
        <div className="agentTitleBlock">
          <div className="agentRobot" aria-hidden>
            <Bot size={22} strokeWidth={1.75} />
          </div>
          <div className="agentTitleMain">
            <div className="agentTitleLine">
              <h1 className="agentNameTitle">{agent.name}</h1>
              <span className={statusClass}>{agent.status}</span>
            </div>
            <div className="agentMetaRow" aria-label="Agent details">
              <span className="agentMetaPhone">{agent.phone}</span>
              <span className="agentMetaDivider" aria-hidden />
              <span className="agentMetaPair">
                <span className="agentMetaLabel">Channels</span>
                <span className="agentMetaValue">{agent.channels}</span>
              </span>
              <span className="agentMetaDivider" aria-hidden />
              <span className="agentMetaPair">
                <span className="agentMetaLabel">Created</span>
                <span className="agentMetaValue">{agent.created}</span>
              </span>
              <span className="agentMetaDivider" aria-hidden />
              <span className="agentMetaPair agentMetaPairId">
                <span className="agentMetaLabel">Agent ID</span>
                <span className="agentMetaIdWrap">
                  <code className="agentMetaIdCode">{agent.agentIdPublic}</code>
                  <button
                    type="button"
                    className="agentIdCopyBtn"
                    aria-label="Copy agent ID"
                    onClick={() =>
                      void navigator.clipboard.writeText(agent.agentIdPublic)
                    }
                  >
                    <Copy size={14} strokeWidth={2} aria-hidden />
                  </button>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="agentHeaderActions">
          <button type="button" className="btn-outline" onClick={() => {}}>
            Copy public link
          </button>
          <button type="button" className="btn-danger-outline" onClick={() => {}}>
            Deactivate
          </button>
        </div>
      </div>

      <nav className="mainTabs" aria-label="Agent sections">
        {(
          [
            ['agent', 'Agent'],
            ['call-settings', 'Call Settings'],
            ['advanced', 'Advanced'],
            ['call-analysis', 'Call Analysis'],
            ['memory', 'Memory'],
            ['sip', 'SIP'],
          ] as const
        ).map(([seg, label]) => (
          <NavLink
            key={seg}
            to={`${agentBasePath}/${seg}`}
            end={seg === 'agent'}
            className={({ isActive }) =>
              `mainTab${isActive ? ' mainTabActive' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
