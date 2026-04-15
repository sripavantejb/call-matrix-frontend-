import { useParams } from 'react-router-dom'
import { AgentWorkspaceTab } from '../../components/agents/tabs/AgentWorkspaceTab'
import { AdvancedTab } from '../../components/agents/tabs/AdvancedTab'
import { CallAnalysisTab } from '../../components/agents/tabs/CallAnalysisTab'
import { MemoryTab } from '../../components/agents/tabs/MemoryTab'
import { SipTab } from '../../components/agents/tabs/SipTab'

/** Remounts workspace when `agentId` changes so local form state resets. */
export function AgentWorkspaceGate() {
  const { agentId } = useParams()
  return <AgentWorkspaceTab key={agentId} />
}

export function AdvancedGate() {
  const { agentId } = useParams()
  return <AdvancedTab key={agentId} />
}

export function CallAnalysisGate() {
  const { agentId } = useParams()
  return <CallAnalysisTab key={agentId} />
}

export function MemoryGate() {
  const { agentId } = useParams()
  return <MemoryTab key={agentId} />
}

export function SipGate() {
  const { agentId } = useParams()
  return <SipTab key={agentId} />
}
