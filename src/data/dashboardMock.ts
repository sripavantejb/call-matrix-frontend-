export type TimeRangeKey = 'all' | '6m' | '30d' | '7d'

export type MetricItem = {
  title: string
  value: string
  sub: string
}

export const metrics: MetricItem[] = [
  { title: 'Total Calls', value: '32', sub: '+32 since last 7 days' },
  { title: 'Total Minutes', value: '0', sub: '+0 since last 7 days' },
  { title: 'Avg Duration', value: '00:00', sub: '+0 since last 7 days' },
  { title: 'Avg Wait Time', value: '0.0 min', sub: '+0 since last 7 days' },
  { title: 'Success Rate', value: '100.00%', sub: '+100% since last 7 days' },
  { title: 'Active Agents', value: '2', sub: 'Active' },
  { title: 'Total Users', value: '32', sub: 'Last 24 hours' },
  { title: 'Active Users', value: '1', sub: 'Last 24 hours' },
]

export type CallsOverTimePoint = {
  label: string
  total: number
  answered: number
  missed: number
  failed: number
  busy: number
  aborted: number
}

/** Sparse demo series — peaks toward the end like the reference */
export const callsOverTimeByRange: Record<TimeRangeKey, CallsOverTimePoint[]> = {
  '7d': [
    { label: 'Mon', total: 0, answered: 0, missed: 0, failed: 0, busy: 0, aborted: 0 },
    { label: 'Tue', total: 2, answered: 2, missed: 0, failed: 0, busy: 0, aborted: 0 },
    { label: 'Wed', total: 4, answered: 3, missed: 1, failed: 0, busy: 0, aborted: 0 },
    { label: 'Thu', total: 8, answered: 7, missed: 1, failed: 0, busy: 0, aborted: 0 },
    { label: 'Fri', total: 12, answered: 11, missed: 1, failed: 0, busy: 0, aborted: 0 },
    { label: 'Sat', total: 18, answered: 16, missed: 2, failed: 0, busy: 0, aborted: 0 },
    { label: 'Sun', total: 32, answered: 28, missed: 3, failed: 1, busy: 0, aborted: 0 },
  ],
  '30d': Array.from({ length: 10 }, (_, i) => ({
    label: `W${i + 1}`,
    total: Math.round((i * i) / 3),
    answered: Math.round((i * i) / 3.5),
    missed: i % 3,
    failed: i % 5 === 0 ? 1 : 0,
    busy: i % 4,
    aborted: 0,
  })),
  '6m': Array.from({ length: 6 }, (_, i) => ({
    label: `M${i + 1}`,
    total: 5 * i,
    answered: 4 * i,
    missed: i,
    failed: 0,
    busy: i % 2,
    aborted: 0,
  })),
  all: Array.from({ length: 8 }, (_, i) => ({
    label: `Y${i + 1}`,
    total: 4 * i,
    answered: 3 * i,
    missed: i,
    failed: 0,
    busy: 0,
    aborted: 0,
  })),
}

export type OutcomeSlice = {
  name: string
  value: number
}

export const callOutcomes: OutcomeSlice[] = [
  { name: 'Success', value: 32 },
  { name: 'Failed', value: 0 },
  { name: 'Missed', value: 0 },
  { name: 'Busy', value: 0 },
  { name: 'Aborted', value: 0 },
  { name: 'Cancelled', value: 0 },
]

export type AgentRow = {
  name: string
  calls: number
}

export const topAgents: AgentRow[] = [
  { name: 'Support Agent', calls: 32 },
  { name: 'Sales Agent', calls: 0 },
  { name: 'Reception', calls: 0 },
  { name: 'After hours', calls: 0 },
  { name: 'Backup', calls: 0 },
]

/** Hour 0–23 */
export const callsByHour: number[] = Array.from({ length: 24 }, (_, h) =>
  [9, 10, 11, 14, 15].includes(h) ? (h === 10 ? 12 : h === 14 ? 8 : 4) : 0,
)

/** Grayscale stops for Recharts (matches --chart-* in index.css) */
export const chartGrayHex = [
  '#111111',
  '#374151',
  '#6b7280',
  '#9ca3af',
  '#d1d5db',
  '#e5e7eb',
] as const

/** Lighter series colors for dark canvas */
export const chartGrayHexDark = [
  '#f4f4f5',
  '#d4d4d8',
  '#a1a1aa',
  '#71717a',
  '#52525b',
  '#3f3f46',
] as const
