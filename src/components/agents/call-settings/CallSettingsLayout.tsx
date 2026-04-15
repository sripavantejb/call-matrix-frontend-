import { Clock, Mic, Volume2, Zap, Gauge, Brain } from 'lucide-react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import '../agents.css'

const segments = [
  { seg: 'in-call-limits', label: 'In-Call Limits', icon: Clock },
  { seg: 'silence-handling', label: 'Silence Handling', icon: Volume2 },
  { seg: 'voice-audio', label: 'Voice & Audio', icon: Mic },
  { seg: 'interruptions', label: 'Interruptions', icon: Zap },
  { seg: 'response-timing', label: 'Response Timing', icon: Gauge },
  { seg: 'supporting-llm', label: 'Supporting LLM', icon: Brain },
] as const

export function CallSettingsLayout() {
  const { agentId } = useParams<{ agentId: string }>()
  const base = agentId ? `/agents/${agentId}/call-settings` : ''

  return (
    <div className="csLayout">
      <nav className="csNav" aria-label="Call settings sections">
        {segments.map(({ seg, label, icon: Icon }) => (
          <NavLink
            key={seg}
            to={`${base}/${seg}`}
            className={({ isActive }) =>
              `csNavItem${isActive ? ' csNavItemActive' : ''}`
            }
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="csPanel">
        <Outlet />
      </div>
    </div>
  )
}
