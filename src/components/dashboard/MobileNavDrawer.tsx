import { X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useShellNav } from '../../context/ShellNavContext'
import { NAV_ITEMS } from './navConfig'
import { HelpTeamModal } from './HelpTeamModal'
import './dashboard.css'

export function MobileNavDrawer() {
  const { navOpen, closeNav } = useShellNav()
  const titleId = useId()
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    if (!navOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeNav()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navOpen, closeNav])

  useEffect(() => {
    if (!navOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navOpen])

  return (
    <>
      {navOpen ? (
        <div
          className="mobileNavOverlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeNav()
          }}
        >
          <div
            id="mobile-nav-drawer"
            className="mobileNavDrawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="mobileNavDrawerHeader">
              <p id={titleId} className="mobileNavDrawerTitle">
                Menu
              </p>
              <button
                type="button"
                className="mobileNavClose"
                aria-label="Close menu"
                onClick={closeNav}
              >
                <X size={22} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            <nav className="mobileNavList" aria-label="Main navigation">
              {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `mobileNavItem${isActive ? ' mobileNavItemActive' : ''}`
                  }
                  onClick={closeNav}
                >
                  <Icon className="navIcon" strokeWidth={1.75} aria-hidden />
                  {label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              className="mobileNavHelp"
              onClick={() => {
                setHelpOpen(true)
                closeNav()
              }}
              aria-haspopup="dialog"
            >
              <p className="sidebarHelpTitle">Need help?</p>
              <p className="sidebarHelpText">Send a message to our team.</p>
            </button>
          </div>
        </div>
      ) : null}
      <HelpTeamModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
