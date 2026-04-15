import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HelpTeamModal } from './HelpTeamModal'
import { NAV_ITEMS } from './navConfig'
import './dashboard.css'

export function Sidebar() {
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <aside className="sidebar sidebarLayout" aria-label="Main navigation">
      <div>
        <div className="brand">
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
          <span className="brandName">Call matrix</span>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `navItem${isActive ? ' navItemActive' : ''}`
              }
            >
              <Icon className="navIcon" strokeWidth={1.75} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        type="button"
        className="sidebarHelp sidebarHelpTrigger"
        onClick={() => setHelpOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={helpOpen}
      >
        <p className="sidebarHelpTitle">Need help?</p>
        <p className="sidebarHelpText">Send a message to our team.</p>
      </button>
      <HelpTeamModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </aside>
  )
}
