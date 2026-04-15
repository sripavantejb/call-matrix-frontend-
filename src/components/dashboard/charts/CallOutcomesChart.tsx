import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useChartTheme } from '../../../hooks/useChartTheme'
import { callOutcomes } from '../../../data/dashboardMock'
import '../dashboard.css'

export function CallOutcomesChart() {
  const chart = useChartTheme()
  const total = callOutcomes.reduce((s, x) => s + x.value, 0)

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
          <h2 className="chartTitle">Call Outcomes</h2>
          <p className="chartSubtitle">Total number of calls by outcome</p>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={callOutcomes}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={108}
              paddingAngle={1}
            >
              {callOutcomes.map((_, i) => (
                <Cell
                  key={callOutcomes[i].name}
                  fill={chart.series[Math.min(i, chart.series.length - 1)]!}
                  stroke="var(--bg-page)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 600,
            color: chart.textPrimary,
            lineHeight: 1.2,
          }}
        >
          {total} Total
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px 16px',
          justifyContent: 'center',
          marginTop: 8,
        }}
      >
        {callOutcomes.map((o, i) => (
          <span
            key={o.name}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 500,
              color: chart.textPrimary,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: chart.series[Math.min(i, chart.series.length - 1)],
              }}
              aria-hidden
            />
            {o.name}
          </span>
        ))}
      </div>
    </div>
  )
}
