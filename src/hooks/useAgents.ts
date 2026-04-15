import { useContext } from 'react'
import { AgentsContext } from '../context/agentsContext'

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used within AgentsProvider')
  return ctx
}
