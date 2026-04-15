import {
  createDefaultTool,
  type AgentTool,
} from '../types/agentTools'

export type AgentType = 'Single Prompt' | 'Multi Prompt'

export type AgentRecord = {
  id: string
  name: string
  type: AgentType
  created: string
  status: 'active' | 'inactive'
  phone: string
  channels: number
  agentIdPublic: string
  firstMessage: string
  systemPrompt: string
  interruptible: boolean
  tools: AgentTool[]
  advanced: {
    llm: string
    stt: string
    tts: string
    knowledgeDoc: string
    concurrentCalls: number
    llmModel: string
    llmTemperature: number
    llmMaxTokens: number
  }
  callAnalysis: {
    postCallAnalysisEnabled: boolean
  }
  memory: {
    conversationMemoryEnabled: boolean
  }
  sip: {
    direction: 'both' | 'inbound-only' | 'outbound-only'
  }
}

export const initialAgents: AgentRecord[] = [
  {
    id: 'agent-1',
    name: 'ciyra',
    type: 'Single Prompt',
    created: 'Apr 9, 2026, 11:39:39',
    status: 'active',
    phone: '+918031336661',
    channels: 0,
    agentIdPublic: 'agent_ciyra_001',
    firstMessage: '',
    systemPrompt: `<identity>You are a friendly assistant.</identity>`,
    interruptible: true,
    tools: [
      { ...createDefaultTool('end_call', 't1'), name: 'end_call' },
      {
        ...createDefaultTool('detect_voice_mail', 't2'),
        name: 'detect_voice_mail',
      },
    ],
    advanced: {
      llm: 'gemini',
      stt: 'sarvam',
      tts: 'cartesia',
      knowledgeDoc: '',
      concurrentCalls: 0,
      llmModel: 'gemini-2.5-flash',
      llmTemperature: 0.18,
      llmMaxTokens: 450,
    },
    callAnalysis: { postCallAnalysisEnabled: false },
    memory: { conversationMemoryEnabled: false },
    sip: { direction: 'both' },
  },
  {
    id: 'agent-2',
    name: 'Agent 1',
    type: 'Single Prompt',
    created: 'Apr 9, 2026, 11:39:33',
    status: 'active',
    phone: '+918000000000',
    channels: 0,
    agentIdPublic: 'agent_one_002',
    firstMessage: '',
    systemPrompt: '',
    interruptible: true,
    tools: [
      { ...createDefaultTool('end_call', 't-agent2-ec'), name: 'end_call' },
      {
        ...createDefaultTool('detect_voice_mail', 't-agent2-vm'),
        name: 'detect_voice_mail',
      },
    ],
    advanced: {
      llm: 'gemini',
      stt: 'sarvam',
      tts: 'cartesia',
      knowledgeDoc: '',
      concurrentCalls: 0,
      llmModel: 'gemini-2.5-flash',
      llmTemperature: 0.18,
      llmMaxTokens: 450,
    },
    callAnalysis: { postCallAnalysisEnabled: false },
    memory: { conversationMemoryEnabled: false },
    sip: { direction: 'both' },
  },
]

export function createAgentRecord(partial: {
  name: string
  type: AgentType
  description?: string
}): AgentRecord {
  const id = `agent-${Date.now()}`
  const now = new Date()
  const created = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return {
    id,
    name: partial.name,
    type: partial.type,
    created,
    status: 'active',
    phone: '+910000000000',
    channels: 0,
    agentIdPublic: `agent_${id}`,
    firstMessage: '',
    systemPrompt: partial.description ?? '',
    interruptible: true,
    tools: [],
    advanced: {
      llm: 'gemini',
      stt: 'sarvam',
      tts: 'cartesia',
      knowledgeDoc: '',
      concurrentCalls: 0,
      llmModel: 'gemini-2.5-flash',
      llmTemperature: 0.18,
      llmMaxTokens: 450,
    },
    callAnalysis: { postCallAnalysisEnabled: false },
    memory: { conversationMemoryEnabled: false },
    sip: { direction: 'both' },
  }
}

export type MainTab =
  | 'agent'
  | 'call-settings'
  | 'advanced'
  | 'call-analysis'
  | 'memory'
  | 'sip'

export type CallSettingsTab =
  | 'in-call-limits'
  | 'silence-handling'
  | 'voice-audio'
  | 'interruptions'
  | 'response-timing'
  | 'supporting-llm'
