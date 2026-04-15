/** Tool kinds — order matches Add menu */
export type AgentToolKind =
  | 'transfer_call_to_human'
  | 'warm_transfer_to_human'
  | 'end_call'
  | 'detect_voice_mail'
  | 'search_rag'
  | 'language_switch'
  | 'custom_tool'

export type AgentTool = {
  id: string
  kind: AgentToolKind
  /** Slug identifier shown in the tools list */
  name: string
  description: string
  phone?: string
  participantName?: string
  summaryInstructions?: string
  useCallTransferStaticMessage?: boolean
  transferMessage?: string
  useEndCallStaticMessage?: boolean
  endCallMessage?: string
  characterLimit?: number
  chunkLimit?: number
  vectorDistance?: number
  useStaticRagSearchMessage?: boolean
  staticRagSearchMessage?: string
  apiMethod?: string
  apiUrl?: string
  timeoutMs?: number
  payloadArgsOnly?: boolean
  payloadFormat?: 'json' | 'form'
  payloadJson?: string
  headers?: { key: string; value: string }[]
  queryParams?: { key: string; value: string }[]
}

export const TOOL_ADD_MENU: { kind: AgentToolKind; label: string }[] = [
  { kind: 'transfer_call_to_human', label: 'Transfer Call To Human Agent' },
  { kind: 'warm_transfer_to_human', label: 'Warm Transfer To Human' },
  { kind: 'end_call', label: 'End Call' },
  { kind: 'detect_voice_mail', label: 'Detect Voice Mail' },
  { kind: 'search_rag', label: 'Search Rag' },
  { kind: 'language_switch', label: 'Language Switch' },
  { kind: 'custom_tool', label: 'Custom Tool' },
]

export const TOOL_MODAL_TITLES: Record<AgentToolKind, string> = {
  transfer_call_to_human: 'Transfer Call To Human Agent',
  warm_transfer_to_human: 'Warm Transfer To Human',
  end_call: 'End Call',
  detect_voice_mail: 'Detect Voice Mail',
  search_rag: 'Search Rag',
  language_switch: 'Language Switch',
  custom_tool: 'Custom Function',
}

export function defaultSlugForKind(kind: AgentToolKind): string {
  const m: Record<AgentToolKind, string> = {
    transfer_call_to_human: 'transfer_call_to_human_agent',
    warm_transfer_to_human: 'warm_transfer_to_human',
    end_call: 'end_call',
    detect_voice_mail: 'detect_voice_mail',
    search_rag: 'search_rag',
    language_switch: 'language_switch',
    custom_tool: 'custom_function',
  }
  return m[kind]
}

export function createDefaultTool(kind: AgentToolKind, id: string): AgentTool {
  const base: AgentTool = {
    id,
    kind,
    name: defaultSlugForKind(kind),
    description: '',
  }
  switch (kind) {
    case 'transfer_call_to_human':
      return {
        ...base,
        description:
          "Use this when the user asks for a real person or if the query is too complex. Requirement: Inform the user they are being transferred (e.g., 'Please stay on the line while I connect you to a human agent') before calling this tool.",
        phone: '+911234567890',
        participantName: 'Billing department Agent',
        useCallTransferStaticMessage: false,
        transferMessage: 'Thank you, have a nice day.',
      }
    case 'warm_transfer_to_human':
      return {
        ...base,
        description:
          'When user requests to speak with a human agent or needs complex assistance that requires human expertise. This tool will brief the human agent about the conversation before connecting them to the caller.',
        phone: '+91 1234567890',
        participantName: 'Billing department Agent',
        summaryInstructions: '',
        useCallTransferStaticMessage: true,
        transferMessage: 'Thank you, have a nice day.',
      }
    case 'end_call':
      return {
        ...base,
        description:
          "Before using the end_call tool for ANY reason, you must always first verbally state: 'Thank you, and have a nice day.' You must not trigger the tool until this sentence has been spoken.",
        useEndCallStaticMessage: true,
        endCallMessage: 'Thank you, have a nice day.',
      }
    case 'detect_voice_mail':
      return {
        ...base,
        description:
          'Detect if the call was picked by a bot like Google Assistant, Siri, etc. Or if it is a standard voice mail. If it is either of them, then just say what the call was about and then hang up the call.',
      }
    case 'search_rag':
      return {
        ...base,
        description:
          'Always use search_rag tool when the user asks about something. Use the keywords provided by the user to retrieve information from the knowledge base.',
        characterLimit: 50000,
        chunkLimit: 20,
        vectorDistance: 0.3,
        useStaticRagSearchMessage: true,
        staticRagSearchMessage: 'Please wait I am checking for information...',
      }
    case 'language_switch':
      return {
        ...base,
        description:
          'Switch the conversation language. Use when user asks to speak in a different language. Available: english, hindi, tamil, telugu, kannada, malayalam, bengali, gujarati, marathi, punjabi, Odia',
      }
    case 'custom_tool':
      return {
        ...base,
        name: '',
        description: '',
        apiMethod: 'POST',
        apiUrl: '',
        timeoutMs: 120000,
        payloadArgsOnly: false,
        payloadFormat: 'json',
        payloadJson:
          '{"doctor_name": "{{doctor_name}}", "date": "{{date}}", "time": "{{time}}"}',
        headers: [{ key: '', value: '' }],
        queryParams: [{ key: '', value: '' }],
      }
    default:
      return base
  }
}
