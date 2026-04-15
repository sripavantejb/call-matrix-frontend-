import { Brain } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAgents } from '../../../hooks/useAgents'
import { SettingsToggleRow } from '../ui/SettingsToggleRow'
import '../agents.css'

export function MemoryTab() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getAgent, updateAgent } = useAgents()
  const agent = agentId ? getAgent(agentId) : undefined

  if (!agent) return null

  const checked = agent.memory.conversationMemoryEnabled

  return (
    <div>
      <SettingsToggleRow
        icon={Brain}
        title="Conversation memory"
        description="• Retain relevant context across turns so the agent can reference earlier parts of the conversation."
        checked={checked}
        switchId="conversation-memory"
        onChange={(next) =>
          updateAgent(agent.id, {
            memory: {
              ...agent.memory,
              conversationMemoryEnabled: next,
            },
          })
        }
      />
    </div>
  )
}
