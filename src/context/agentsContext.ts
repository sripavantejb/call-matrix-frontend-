import { createContext } from 'react'
import type { AgentRecord, AgentType } from '../data/agentsMock'

export type AgentsContextValue = {
  agents: AgentRecord[]
  addAgent: (input: {
    name: string
    type: AgentType
    description?: string
  }) => AgentRecord
  updateAgent: (id: string, patch: Partial<AgentRecord>) => void
  getAgent: (id: string) => AgentRecord | undefined
}

export const AgentsContext = createContext<AgentsContextValue | null>(null)
