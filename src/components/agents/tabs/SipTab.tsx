import { ArrowRightLeft, PhoneIncoming } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAgents } from '../../../hooks/useAgents'
import '../agents.css'

export function SipTab() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getAgent } = useAgents()
  const agent = agentId ? getAgent(agentId) : undefined

  if (!agent) return null

  const direction = agent.sip.direction
  const directionLabel =
    direction === 'both'
      ? 'both'
      : direction === 'inbound-only'
        ? 'inbound'
        : 'outbound'

  return (
    <div>
      <h2 className="sipSectionTitle">SIP configuration</h2>
      <div className="sipPhoneCard">
        <div>
          <p className="sipPhoneLabel">Phone number</p>
          <p className="sipPhoneValue">{agent.phone}</p>
          <p className="sipPhoneMeta">{directionLabel}</p>
        </div>
        <div className="sipPhoneIcons" aria-hidden>
          <PhoneIncoming size={22} strokeWidth={1.5} />
          <ArrowRightLeft size={22} strokeWidth={1.5} />
        </div>
      </div>
      <div className="sipActions">
        <button type="button" className="btn-primary">
          Edit number
        </button>
        <button type="button" className="btn-danger-outline">
          Remove from inbound
        </button>
        <button type="button" className="btn-danger-outline">
          Remove from outbound
        </button>
      </div>
    </div>
  )
}
