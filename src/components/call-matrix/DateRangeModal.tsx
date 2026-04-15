import { useEffect, useId, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { endOfDay, startOfDay } from '../../data/callMatrixMock'
import {
  formatRangeButtonLabel,
  rangeLastNDays,
  rangeThisMonth,
  rangeToday,
  rangeYesterday,
  type DatePresetId,
} from './dateRangePresets'
import '../agents/agents.css'
import './call-matrix.css'

type DateRangeModalProps = {
  open: boolean
  onClose: () => void
  appliedFrom: Date
  appliedTo: Date
  appliedPreset: DatePresetId | null
  onApply: (from: Date, to: Date, preset: DatePresetId | null) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const pad = first.getDay()
  const dim = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < pad; i++) cells.push(null)
  for (let d = 1; d <= dim; d++) {
    cells.push(new Date(year, month, d))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function inRange(day: Date, from: Date, to: Date) {
  const t = startOfDay(day).getTime()
  return t >= startOfDay(from).getTime() && t <= endOfDay(to).getTime()
}

export function DateRangeModal({
  open,
  onClose,
  appliedFrom,
  appliedTo,
  appliedPreset,
  onApply,
}: DateRangeModalProps) {
  const titleId = useId()
  const [pendingFrom, setPendingFrom] = useState(appliedFrom)
  const [pendingTo, setPendingTo] = useState(appliedTo)
  const [pendingPreset, setPendingPreset] = useState<DatePresetId | null>(appliedPreset)
  const [cursor, setCursor] = useState(() => ({
    y: appliedFrom.getFullYear(),
    m: appliedFrom.getMonth(),
  }))
  const [firstClick, setFirstClick] = useState<Date | null>(null)

  useEffect(() => {
    if (!open) return
    setPendingFrom(appliedFrom)
    setPendingTo(appliedTo)
    setPendingPreset(appliedPreset)
    setCursor({ y: appliedFrom.getFullYear(), m: appliedFrom.getMonth() })
    setFirstClick(null)
  }, [open, appliedFrom, appliedTo, appliedPreset])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const grid = buildMonthGrid(cursor.y, cursor.m)
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const applyPreset = (id: DatePresetId) => {
    let r: { from: Date; to: Date }
    if (id === 'today') r = rangeToday()
    else if (id === 'yesterday') r = rangeYesterday()
    else if (id === 'last7') r = rangeLastNDays(7)
    else if (id === 'last30') r = rangeLastNDays(30)
    else if (id === 'last90') r = rangeLastNDays(90)
    else if (id === 'thisMonth') r = rangeThisMonth()
    else return
    setPendingFrom(r.from)
    setPendingTo(r.to)
    setPendingPreset(id)
    setFirstClick(null)
    setCursor({ y: r.from.getFullYear(), m: r.from.getMonth() })
  }

  const onDayClick = (d: Date) => {
    const ds = startOfDay(d)
    const de = endOfDay(d)
    setPendingPreset('custom')
    if (!firstClick) {
      setFirstClick(ds)
      setPendingFrom(ds)
      setPendingTo(de)
      return
    }
    const a = firstClick.getTime()
    const b = ds.getTime()
    if (b < a) {
      setPendingFrom(ds)
      setPendingTo(endOfDay(firstClick))
    } else {
      setPendingFrom(firstClick)
      setPendingTo(de)
    }
    setFirstClick(null)
  }

  const summary = formatRangeButtonLabel(pendingFrom, pendingTo, pendingPreset)

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modalPanel cmDateModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="sr-only">
          Select date range
        </h2>
        <div className="cmDateModalBody">
          <div className="cmQuickCol">
            <p className="cmQuickTitle">Quick select</p>
            <ul className="cmQuickList">
              {(
                [
                  ['today', 'Today'],
                  ['yesterday', 'Yesterday'],
                  ['last7', 'Last 7 days'],
                  ['last30', 'Last 30 days'],
                  ['last90', 'Last 90 days'],
                  ['thisMonth', 'This month'],
                ] as const
              ).map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    className={`cmQuickItem${pendingPreset === id ? ' cmQuickItemActive' : ''}`}
                    onClick={() => applyPreset(id)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="cmCalCol">
            <div className="cmCalHeader">
              <button
                type="button"
                className="cmCalNav"
                aria-label="Previous month"
                onClick={() =>
                  setCursor((c) => {
                    const nm = c.m - 1
                    if (nm < 0) return { y: c.y - 1, m: 11 }
                    return { y: c.y, m: nm }
                  })
                }
              >
                <ChevronLeft size={20} strokeWidth={1.75} />
              </button>
              <span className="cmCalMonth">{monthLabel}</span>
              <button
                type="button"
                className="cmCalNav"
                aria-label="Next month"
                onClick={() =>
                  setCursor((c) => {
                    const nm = c.m + 1
                    if (nm > 11) return { y: c.y + 1, m: 0 }
                    return { y: c.y, m: nm }
                  })
                }
              >
                <ChevronRight size={20} strokeWidth={1.75} />
              </button>
            </div>
            <div className="cmWeekRow" aria-hidden>
              {WEEKDAYS.map((w) => (
                <span key={w} className="cmWeekCell">
                  {w}
                </span>
              ))}
            </div>
            <div className="cmGrid">
              {grid.map((cell, i) => {
                if (!cell) {
                  return <div key={`e-${i}`} className="cmDay cmDayEmpty" />
                }
                const inR = inRange(cell, pendingFrom, pendingTo)
                const isStart = sameDay(cell, pendingFrom)
                const isEnd = sameDay(cell, pendingTo)
                return (
                  <button
                    key={cell.toISOString()}
                    type="button"
                    className={`cmDay${inR ? ' cmDayInRange' : ''}${isStart ? ' cmDayStart' : ''}${isEnd ? ' cmDayEnd' : ''}`}
                    onClick={() => onDayClick(cell)}
                  >
                    {cell.getDate()}
                  </button>
                )
              })}
            </div>
            <p className="cmRangeSummary">{summary}</p>
          </div>
        </div>
        <div className="cmDateModalFooter">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onApply(pendingFrom, pendingTo, pendingPreset)
              onClose()
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
