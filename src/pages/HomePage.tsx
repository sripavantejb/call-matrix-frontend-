import { MetricCard } from '../components/dashboard/MetricCard'
import { CallsOverTimeChart } from '../components/dashboard/charts/CallsOverTimeChart'
import { CallOutcomesChart } from '../components/dashboard/charts/CallOutcomesChart'
import { TopAgentsChart } from '../components/dashboard/charts/TopAgentsChart'
import { CallsByHourChart } from '../components/dashboard/charts/CallsByHourChart'
import { metrics } from '../data/dashboardMock'
import {
  Clock,
  Hourglass,
  Percent,
  Phone,
  Timer,
  UserPlus,
  Users,
  UsersRound,
} from 'lucide-react'
import '../components/dashboard/dashboard.css'

const metricIcons = [
  Phone,
  Clock,
  Timer,
  Hourglass,
  Percent,
  Users,
  UsersRound,
  UserPlus,
] as const

function greetingForNow(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning, Sir'
  if (h < 17) return 'Good afternoon, Sir'
  return 'Good evening, Sir'
}

export function HomePage() {
  return (
    <>
      <h1 className="greeting">{greetingForNow()}</h1>
      <section className="metricGrid" aria-label="Key metrics">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            sub={m.sub}
            icon={metricIcons[i] ?? Phone}
          />
        ))}
      </section>

      <section className="chartRow" aria-label="Calls over time">
        <CallsOverTimeChart />
      </section>

      <section className="chartRowSplit" aria-label="Outcomes and agents">
        <CallOutcomesChart />
        <TopAgentsChart />
      </section>

      <section className="chartRow" aria-label="Calls by hour">
        <CallsByHourChart />
      </section>
    </>
  )
}
