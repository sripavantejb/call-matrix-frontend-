export type PhoneNumberCapability = 'inbound' | 'outbound'

export type PhoneNumberRow = {
  id: string
  phone: string
  types: PhoneNumberCapability[]
  inboundAgent: string
  outboundAgent: string
  addedAt: Date
}

export const MOCK_PHONE_NUMBERS: PhoneNumberRow[] = [
  {
    id: '1',
    phone: '+918031336661',
    types: ['inbound', 'outbound'],
    inboundAgent: 'clyra',
    outboundAgent: 'clyra',
    addedAt: new Date('2026-04-09T12:00:00'),
  },
  {
    id: '2',
    phone: '+918031152621',
    types: ['inbound', 'outbound'],
    inboundAgent: 'Agent 1',
    outboundAgent: 'Agent 1',
    addedAt: new Date('2026-04-09T12:00:00'),
  },
]
