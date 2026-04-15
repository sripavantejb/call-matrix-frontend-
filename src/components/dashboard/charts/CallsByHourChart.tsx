import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useChartTheme } from '../../../hooks/useChartTheme'
import { callsByHour } from '../../../data/dashboardMock'
import '../dashboard.css'

const data = callsByHour.map((calls, hour) => ({ hour: String(hour), calls }))

export function CallsByHourChart() {
  const chart = useChartTheme()

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
      <div className="chartCardHeader" style={{ marginBottom: 8 }}>
        <div>
          <h2 className="chartTitle">Calls By Hour</h2>
          <p className="chartSubtitle">Total number of calls by hour of the day</p>
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={chart.grid} vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: chart.tick, fontSize: 11 }}
              axisLine={{ stroke: chart.axis }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: chart.tick, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(h) => `Hour ${h}`}
            />
            <Bar
              dataKey="calls"
              name="Calls"
              radius={[4, 4, 0, 0]}
              fill={chart.series[2]!}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
