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
import { topAgents } from '../../../data/dashboardMock'
import '../dashboard.css'

export function TopAgentsChart() {
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
          <h2 className="chartTitle">Top Agents</h2>
          <p className="chartSubtitle">Top 5 agents by number of calls</p>
        </div>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart
            data={topAgents}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <CartesianGrid stroke={chart.grid} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: chart.tick, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{
                fill: chart.textPrimary,
                fontSize: 12,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="calls"
              name="Calls"
              radius={[0, 6, 6, 0]}
              fill={chart.series[1]!}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
