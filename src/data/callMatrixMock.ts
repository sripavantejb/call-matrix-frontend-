export type ConversationStatus =
  | 'picked'
  | 'not_picked'
  | 'busy'
  | 'voicemail'
  | 'failed'
  | 'in_progress'

export type CallDirection = 'inbound' | 'outbound'

export type ConversationRow = {
  id: string
  startedAt: Date
  phone: string
  agent: string
  tags: string | null
  durationSec: number
  status: ConversationStatus
  campaign: string
  callType: CallDirection
}

function daysAgo(days: number, hour: number, minute: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, minute, 0, 0)
  return d
}

/** Seeded relative to runtime "today" so Last 7 days always has rows in dev. */
export const MOCK_CONVERSATIONS: ConversationRow[] = [
  { id: '1', startedAt: daysAgo(0, 14, 12), phone: '+917989757750', agent: 'clyra', tags: null, durationSec: 72, status: 'picked', campaign: 'Spring Sale', callType: 'inbound' },
  { id: '2', startedAt: daysAgo(0, 13, 45), phone: '+919876543210', agent: 'clyra', tags: null, durationSec: 14, status: 'picked', campaign: 'Onboarding', callType: 'outbound' },
  { id: '3', startedAt: daysAgo(0, 11, 20), phone: '+918123456789', agent: 'shyam', tags: 'VIP', durationSec: 4, status: 'picked', campaign: 'Support', callType: 'inbound' },
  { id: '4', startedAt: daysAgo(0, 10, 5), phone: '+917012345678', agent: 'Agent 1', tags: null, durationSec: 107, status: 'picked', campaign: 'Spring Sale', callType: 'outbound' },
  { id: '5', startedAt: daysAgo(1, 16, 30), phone: '+916612345678', agent: 'clyra', tags: null, durationSec: 32, status: 'picked', campaign: 'Onboarding', callType: 'inbound' },
  { id: '6', startedAt: daysAgo(1, 15, 10), phone: '+915512345678', agent: 'shyam', tags: null, durationSec: 88, status: 'not_picked', campaign: 'Support', callType: 'outbound' },
  { id: '7', startedAt: daysAgo(1, 9, 0), phone: '+914412345678', agent: 'clyra', tags: null, durationSec: 0, status: 'busy', campaign: 'Spring Sale', callType: 'inbound' },
  { id: '8', startedAt: daysAgo(2, 18, 22), phone: '+913312345678', agent: 'Agent 1', tags: null, durationSec: 45, status: 'picked', campaign: 'Onboarding', callType: 'inbound' },
  { id: '9', startedAt: daysAgo(2, 12, 0), phone: '+912212345678', agent: 'clyra', tags: null, durationSec: 120, status: 'voicemail', campaign: 'Support', callType: 'outbound' },
  { id: '10', startedAt: daysAgo(2, 10, 15), phone: '+911112345678', agent: 'shyam', tags: null, durationSec: 12, status: 'picked', campaign: 'Spring Sale', callType: 'inbound' },
  { id: '11', startedAt: daysAgo(3, 17, 40), phone: '+919988776655', agent: 'clyra', tags: null, durationSec: 200, status: 'failed', campaign: 'Onboarding', callType: 'outbound' },
  { id: '12', startedAt: daysAgo(3, 14, 8), phone: '+918877665544', agent: 'Agent 1', tags: 'Lead', durationSec: 67, status: 'picked', campaign: 'Support', callType: 'inbound' },
  { id: '13', startedAt: daysAgo(3, 11, 30), phone: '+917766554433', agent: 'clyra', tags: null, durationSec: 8, status: 'in_progress', campaign: 'Spring Sale', callType: 'outbound' },
  { id: '14', startedAt: daysAgo(4, 19, 0), phone: '+916655443322', agent: 'shyam', tags: null, durationSec: 55, status: 'picked', campaign: 'Onboarding', callType: 'inbound' },
  { id: '15', startedAt: daysAgo(4, 8, 12), phone: '+915544332211', agent: 'clyra', tags: null, durationSec: 33, status: 'picked', campaign: 'Support', callType: 'outbound' },
  { id: '16', startedAt: daysAgo(5, 20, 50), phone: '+914433221100', agent: 'Agent 1', tags: null, durationSec: 91, status: 'picked', campaign: 'Spring Sale', callType: 'inbound' },
  { id: '17', startedAt: daysAgo(5, 13, 25), phone: '+913322110099', agent: 'clyra', tags: null, durationSec: 22, status: 'not_picked', campaign: 'Onboarding', callType: 'outbound' },
  { id: '18', startedAt: daysAgo(5, 9, 5), phone: '+912211009988', agent: 'shyam', tags: null, durationSec: 156, status: 'picked', campaign: 'Support', callType: 'inbound' },
  { id: '19', startedAt: daysAgo(6, 16, 18), phone: '+911100998877', agent: 'clyra', tags: null, durationSec: 41, status: 'picked', campaign: 'Spring Sale', callType: 'outbound' },
  { id: '20', startedAt: daysAgo(6, 10, 42), phone: '+910099887766', agent: 'Agent 1', tags: null, durationSec: 19, status: 'busy', campaign: 'Onboarding', callType: 'inbound' },
  { id: '21', startedAt: daysAgo(7, 15, 0), phone: '+918889990011', agent: 'clyra', tags: null, durationSec: 64, status: 'picked', campaign: 'Support', callType: 'outbound' },
  { id: '22', startedAt: daysAgo(7, 12, 33), phone: '+917778889900', agent: 'shyam', tags: null, durationSec: 7, status: 'voicemail', campaign: 'Spring Sale', callType: 'inbound' },
  { id: '23', startedAt: daysAgo(8, 14, 20), phone: '+916667778899', agent: 'clyra', tags: null, durationSec: 99, status: 'picked', campaign: 'Onboarding', callType: 'inbound' },
  { id: '24', startedAt: daysAgo(10, 11, 11), phone: '+915556667788', agent: 'Agent 1', tags: null, durationSec: 28, status: 'picked', campaign: 'Support', callType: 'outbound' },
  { id: '25', startedAt: daysAgo(12, 9, 55), phone: '+914445556677', agent: 'clyra', tags: 'Callback', durationSec: 180, status: 'failed', campaign: 'Spring Sale', callType: 'inbound' },
  { id: '26', startedAt: daysAgo(15, 17, 7), phone: '+913334445566', agent: 'shyam', tags: null, durationSec: 50, status: 'picked', campaign: 'Onboarding', callType: 'outbound' },
  { id: '27', startedAt: daysAgo(20, 8, 0), phone: '+912223334455', agent: 'clyra', tags: null, durationSec: 36, status: 'not_picked', campaign: 'Support', callType: 'inbound' },
  { id: '28', startedAt: daysAgo(25, 13, 14), phone: '+911112223344', agent: 'Agent 1', tags: null, durationSec: 14, status: 'picked', campaign: 'Spring Sale', callType: 'outbound' },
  { id: '29', startedAt: daysAgo(30, 19, 45), phone: '+910001112233', agent: 'clyra', tags: null, durationSec: 77, status: 'picked', campaign: 'Onboarding', callType: 'inbound' },
  { id: '30', startedAt: daysAgo(35, 10, 30), phone: '+919990001122', agent: 'shyam', tags: null, durationSec: 210, status: 'picked', campaign: 'Support', callType: 'inbound' },
  { id: '31', startedAt: daysAgo(45, 16, 0), phone: '+918880009911', agent: 'clyra', tags: null, durationSec: 5, status: 'busy', campaign: 'Spring Sale', callType: 'outbound' },
  { id: '32', startedAt: daysAgo(60, 12, 22), phone: '+917770008800', agent: 'Agent 1', tags: null, durationSec: 92, status: 'picked', campaign: 'Onboarding', callType: 'inbound' },
  { id: '33', startedAt: daysAgo(75, 9, 17), phone: '+916660007700', agent: 'clyra', tags: null, durationSec: 44, status: 'voicemail', campaign: 'Support', callType: 'outbound' },
  { id: '34', startedAt: daysAgo(88, 14, 38), phone: '+915550006600', agent: 'shyam', tags: null, durationSec: 63, status: 'picked', campaign: 'Spring Sale', callType: 'inbound' },
  { id: '35', startedAt: daysAgo(89, 11, 5), phone: '+914440005500', agent: 'clyra', tags: null, durationSec: 11, status: 'failed', campaign: 'Onboarding', callType: 'outbound' },
  { id: '36', startedAt: daysAgo(0, 8, 0), phone: '+913330004400', agent: 'Agent 1', tags: null, durationSec: 240, status: 'picked', campaign: 'Support', callType: 'inbound' },
]

export function distinctAgents(rows: ConversationRow[]): string[] {
  return [...new Set(rows.map((r) => r.agent))].sort()
}

export function distinctCampaigns(rows: ConversationRow[]): string[] {
  return [...new Set(rows.map((r) => r.campaign))].sort()
}

export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function endOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

export function isWithinRange(date: Date, from: Date, to: Date): boolean {
  const t = date.getTime()
  return t >= from.getTime() && t <= to.getTime()
}
