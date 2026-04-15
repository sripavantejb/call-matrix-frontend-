import { Navigate, useParams } from 'react-router-dom'

export function CallSettingsIndexRedirect() {
  const { agentId } = useParams<{ agentId: string }>()
  if (!agentId) return <Navigate to="/agents" replace />
  return (
    <Navigate
      to={`/agents/${agentId}/call-settings/in-call-limits`}
      replace
    />
  )
}
