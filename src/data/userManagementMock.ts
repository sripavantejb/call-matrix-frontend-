export type TeamMemberRole = 'admin' | 'member'

export type TeamMemberStatus = 'active' | 'invited'

export type TeamMember = {
  id: string
  displayName: string
  email: string
  role: TeamMemberRole
  status: TeamMemberStatus
  joinedAt: Date
  lastActiveAt: Date
  isYou?: boolean
}

export type AccessRequest = {
  id: string
  email: string
  requestedAt: Date
}

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    displayName: 'Sri Pavan Tej',
    email: 'sripavantej@gmail.com',
    role: 'admin',
    status: 'active',
    joinedAt: new Date('2026-04-08T12:00:00'),
    lastActiveAt: new Date('2026-04-11T12:00:00'),
    isYou: true,
  },
]

export const MOCK_ACCESS_REQUESTS: AccessRequest[] = []
