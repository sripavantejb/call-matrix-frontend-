import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useChartTheme } from '../../../hooks/useChartTheme'
import type { TimeRangeKey } from '../../../data/dashboardMock'
import { callsOverTimeByRange } from '../../../data/dashboardMock'
import '../dashboard.css'

const RANGES: { key: TimeRangeKey; label: string }[] = [
  { key: 'all', label: 'All time' },
  { key: '6m', label: 'Last 6 months' },
  { key: '30d', label: 'Last 30 days' },
  { key: '7d', label: 'Last 7 days' },
]

const LEGEND_LABELS = [
  'Total Calls',
  'Answered Calls',
  'Missed Calls',
  'Failed',
  'Busy',
  'Aborted',
] as const

export function CallsOverTimeChart() {
  const chart = useChartTheme()
  const [range, setRange] = useState<TimeRangeKey>('7d')
  const data = callsOverTimeByRange[range]

  const legendItems = useMemo(
    () =>
      LEGEND_LABELS.map((label, i) => ({
        label,
        color: chart.series[Math.min(i, chart.series.length - 1)]!,
      })),
    [chart.series],
  )

  const tooltipStyle = useMemo(
    () => ({
      background: chart.tooltipBg,
      border: `1px solid ${chart.tooltipBorder}`,
      borderRadius: 8,
      boxShadow: 'var(--shadow-card)',
      color: chart.textPrimary,
      fontSize: 12,
    }),
    [chart],
  )

  return (
    <div className="chartCard">
      <div className="chartCardHeader">
        <div>
          <h2 className="chartTitle">Total Calls Over Time</h2>
          <p className="chartSubtitle">Overview of calls made over time</p>
        </div>
        <div className="rangeGroup" role="group" aria-label="Time range">
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`rangePill${range === key ? ' rangePillActive' : ''}`}
              onClick={() => setRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="totalCallsFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chart.series[0]}
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor={chart.series[0]}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chart.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: chart.tick, fontSize: 12 }}
              axisLine={{ stroke: chart.axis }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: chart.tick, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: chart.textPrimary, fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Total Calls"
              stroke={chart.series[0]}
              strokeWidth={2}
              fill="url(#totalCallsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div
        className="chartLegendRow"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 20px',
          marginTop: 16,
          justifyContent: 'center',
        }}
      >
        {legendItems.map((item) => (
          <span
            key={item.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 500,
              color: chart.textPrimary,
              fontFamily: 'var(--font-body)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: item.color,
              }}
              aria-hidden
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
