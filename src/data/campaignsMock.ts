export type CampaignStatus = 'active' | 'inactive' | 'completed'
export type CampaignType = 'outbound' | 'inbound'

export type CampaignAgent = {
  id: string
  name: string
  agentId: number
  status: 'active' | 'inactive'
  /** Workspace agent id when added via Select Agent modal (dedupe). */
  sourceAgentId?: string
}

export type CallTag = {
  id: string
  label: string
  color: string
  description: string
}

export type ContactUpload = {
  id: string
  filename: string
  uploadedAt: string
  status: 'success' | 'error'
}

export type Campaign = {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  startTime: string
  endTime: string
  businessHoursOnly: boolean
  retryWaitMinutes: number
  maxRetries: number
  createdAt: string
  workflowUrl: string
  agents: CampaignAgent[]
  callTags: CallTag[]
  contacts: ContactUpload[]
  queueBuffer: number
  workersRunning: number
  totalQueued: number
}

/** Start/stop campaign for UI demo: fills queue when starting, clears when stopping. */
export function applyCampaignRunningState(
  c: Campaign,
  running: boolean,
): Campaign {
  if (!running) {
    return {
      ...c,
      status: 'inactive',
      totalQueued: 0,
      queueBuffer: 0,
      workersRunning: 0,
    }
  }
  const activeAgents = c.agents.filter((a) => a.status === 'active').length
  const workers = Math.max(1, activeAgents)
  const queued = Math.max(128, c.contacts.length * 24, 1)
  return {
    ...c,
    status: 'active',
    totalQueued: queued,
    queueBuffer: 0,
    workersRunning: workers,
  }
}

export const CAMPAIGN_SEED: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Demo Reminder Calls',
    type: 'outbound',
    status: 'inactive',
    startTime: '16:00',
    endTime: '17:55',
    businessHoursOnly: true,
    retryWaitMinutes: 10,
    maxRetries: 2,
    createdAt: 'Apr 7, 2026, 04:14 PM',
    workflowUrl: '',
    agents: [
      { id: 'ca-1', name: 'Demo Reminder Call', agentId: 139, status: 'active' },
    ],
    callTags: [
      { id: 'ct-1', label: 'Reschedule', color: '#F45F5E', description: 'If user want to reschedule' },
    ],
    contacts: [
      { id: 'cu-1', filename: '1775818195-updated_phone_numbers.csv', uploadedAt: '4/10/2026, 4:19:55 PM', status: 'success' },
      { id: 'cu-2', filename: '1775817258-FINAL_CORRECTED.csv', uploadedAt: '4/10/2026, 4:04:18 PM', status: 'success' },
      { id: 'cu-3', filename: '1775733048-FINAL_CORRECTED.csv', uploadedAt: '4/9/2026, 4:40:48 PM', status: 'success' },
      { id: 'cu-4', filename: '1775644187-Guide_xpert_-_8th_demo_reminder.csv', uploadedAt: '4/8/2026, 3:59:48 PM', status: 'success' },
      { id: 'cu-5', filename: '1775560399-Testing_Sheet_-_guidxperrt.csv', uploadedAt: '4/7/2026, 4:43:19 PM', status: 'success' },
    ],
    queueBuffer: 0,
    workersRunning: 0,
    totalQueued: 0,
  },
  {
    id: 'camp-2',
    name: 'Demo Reminder Call',
    type: 'outbound',
    status: 'inactive',
    startTime: '09:00',
    endTime: '18:00',
    businessHoursOnly: true,
    retryWaitMinutes: 10,
    maxRetries: 2,
    createdAt: 'Apr 7, 2026, 03:30 PM',
    workflowUrl: '',
    agents: [],
    callTags: [],
    contacts: [],
    queueBuffer: 0,
    workersRunning: 0,
    totalQueued: 0,
  },
  {
    id: 'camp-3',
    name: 'Guide Xpert Demo Schedule',
    type: 'outbound',
    status: 'inactive',
    startTime: '09:00',
    endTime: '18:00',
    businessHoursOnly: true,
    retryWaitMinutes: 30,
    maxRetries: 3,
    createdAt: 'Mar 16, 2026, 02:00 PM',
    workflowUrl: '',
    agents: [],
    callTags: [],
    contacts: [],
    queueBuffer: 0,
    workersRunning: 0,
    totalQueued: 0,
  },
  {
    id: 'camp-4',
    name: 'Guide Xpert Outbound',
    type: 'outbound',
    status: 'inactive',
    startTime: '09:00',
    endTime: '18:00',
    businessHoursOnly: true,
    retryWaitMinutes: 10,
    maxRetries: 2,
    createdAt: 'Mar 10, 2026, 10:00 AM',
    workflowUrl: '',
    agents: [],
    callTags: [],
    contacts: [],
    queueBuffer: 0,
    workersRunning: 0,
    totalQueued: 0,
  },
  {
    id: 'camp-5',
    name: 'Q1 Sales Outreach',
    type: 'outbound',
    status: 'inactive',
    startTime: '10:00',
    endTime: '17:00',
    businessHoursOnly: true,
    retryWaitMinutes: 5,
    maxRetries: 1,
    createdAt: 'Feb 20, 2026, 11:15 AM',
    workflowUrl: '',
    agents: [],
    callTags: [],
    contacts: [],
    queueBuffer: 0,
    workersRunning: 0,
    totalQueued: 0,
  },
]
