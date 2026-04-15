import { FileText } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAgents } from '../../../hooks/useAgents'
import { SettingsToggleRow } from '../ui/SettingsToggleRow'
import '../agents.css'

export function CallAnalysisTab() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getAgent, updateAgent } = useAgents()
  const agent = agentId ? getAgent(agentId) : undefined

  if (!agent) return null

  const checked = agent.callAnalysis.postCallAnalysisEnabled

  return (
    <div>
      <SettingsToggleRow
        icon={FileText}
        title="Post-Call Analysis"
        description="• Run an LLM analysis after each call to generate a summary and structured data."
        checked={checked}
        switchId="post-call-analysis"
        onChange={(next) =>
          updateAgent(agent.id, {
            callAnalysis: {
              ...agent.callAnalysis,
              postCallAnalysisEnabled: next,
            },
          })
        }
      />
    </div>
  )
}
