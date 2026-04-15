import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createAgentRecord,
  initialAgents,
  type AgentRecord,
  type AgentType,
} from '../data/agentsMock'
import { AgentsContext, type AgentsContextValue } from './agentsContext'

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<AgentRecord[]>(initialAgents)

  const addAgent = useCallback(
    (input: { name: string; type: AgentType; description?: string }) => {
      const created = createAgentRecord(input)
      setAgents((prev) => [...prev, created])
      return created
    },
    [],
  )

  const updateAgent = useCallback((id: string, patch: Partial<AgentRecord>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    )
  }, [])

  const getAgent = useCallback(
    (id: string) => agents.find((a) => a.id === id),
    [agents],
  )

  const value = useMemo<AgentsContextValue>(
    () => ({ agents, addAgent, updateAgent, getAgent }),
    [agents, addAgent, updateAgent, getAgent],
  )

  return (
    <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>
  )
}
