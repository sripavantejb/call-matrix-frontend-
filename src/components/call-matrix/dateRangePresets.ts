import { endOfDay, startOfDay } from '../../data/callMatrixMock'

export type DatePresetId =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'last90'
  | 'thisMonth'
  | 'custom'

export function rangeToday(): { from: Date; to: Date } {
  const n = new Date()
  return { from: startOfDay(n), to: endOfDay(n) }
}

export function rangeYesterday(): { from: Date; to: Date } {
  const n = new Date()
  n.setDate(n.getDate() - 1)
  return { from: startOfDay(n), to: endOfDay(n) }
}

export function rangeLastNDays(n: number): { from: Date; to: Date } {
  const to = endOfDay(new Date())
  const from = startOfDay(new Date())
  from.setDate(from.getDate() - (n - 1))
  return { from, to }
}

export function rangeThisMonth(): { from: Date; to: Date } {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
  from.setHours(0, 0, 0, 0)
  return { from, to: endOfDay(now) }
}

export function formatRangeButtonLabel(from: Date, to: Date, preset: DatePresetId | null): string {
  if (preset === 'today') return 'Today'
  if (preset === 'yesterday') return 'Yesterday'
  if (preset === 'last7') return 'Last 7 days'
  if (preset === 'last30') return 'Last 30 days'
  if (preset === 'last90') return 'Last 90 days'
  if (preset === 'thisMonth') return 'This month'
  const sameYear = from.getFullYear() === to.getFullYear()
  const optsFrom: Intl.DateTimeFormatOptions = sameYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' }
  const optsTo: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return `${from.toLocaleDateString(undefined, optsFrom)} – ${to.toLocaleDateString(undefined, optsTo)}`
}
