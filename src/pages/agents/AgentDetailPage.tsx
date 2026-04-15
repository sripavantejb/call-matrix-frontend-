import { Navigate, Outlet, useParams } from 'react-router-dom'
import { AgentDetailHeader } from '../../components/agents/AgentDetailHeader'
import { useAgents } from '../../hooks/useAgents'
import '../../components/agents/agents.css'

export function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getAgent } = useAgents()
  const agent = agentId ? getAgent(agentId) : undefined

  if (!agentId) return <Navigate to="/agents" replace />
  if (!agent) return <Navigate to="/agents" replace />

  const base = `/agents/${agentId}`

  return (
    <div>
      <AgentDetailHeader agent={agent} agentBasePath={base} />
      <Outlet />
    </div>
  )
}
