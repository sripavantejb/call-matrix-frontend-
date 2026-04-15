import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Bot,
  FileText,
  LayoutDashboard,
  Megaphone,
  Phone,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import '../../components/dashboard/dashboard.css'

const ITEMS: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/credentials', label: 'Credentials', icon: Shield },
  { to: '/admin/agents', label: 'Agents', icon: Bot },
  { to: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/admin/calls', label: 'Calls', icon: Phone },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/logs', label: 'System Logs', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  return (
    <aside className="sidebar adminSidebarOnly" aria-label="Admin navigation">
      <div>
        <div className="brand adminBrandStack">
          <div className="brandIcon" aria-hidden>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
          <div>
            <span className="brandName">Call matrix</span>
            <p className="adminBrandSub">Admin</p>
          </div>
        </div>
        <nav className="nav">
          {ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={Boolean(end)}
              className={({ isActive }) => `navItem${isActive ? ' navItemActive' : ''}`}
            >
              <Icon className="navIcon" size={20} strokeWidth={1.75} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
