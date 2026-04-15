import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeProvider'
import { useShellNav } from '../../context/ShellNavContext'
import './dashboard.css'

type TopBarProps = {
  userName: string
  userInitials: string
}

export function TopBar({ userName, userInitials }: TopBarProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { navOpen, toggleNav } = useShellNav()
  const isDark = resolvedTheme === 'dark'

  return (
    <header className="topBar">
      <div className="topBarLeading">
        <button
          type="button"
          className="iconButton topBarMenuBtn"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          onClick={toggleNav}
        >
          <Menu size={20} strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <div className="topBarTrailing">
        <button type="button" className="iconButton" aria-label="Search">
          <Search size={20} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="iconButton"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? (
            <Sun size={20} strokeWidth={1.75} aria-hidden />
          ) : (
            <Moon size={20} strokeWidth={1.75} aria-hidden />
          )}
        </button>
        <button type="button" className="iconButton" aria-label="Notifications">
          <Bell size={20} strokeWidth={1.75} />
        </button>
        <div className="userBlock">
          <span className="avatar" aria-hidden>
            {userInitials}
          </span>
          <span className="userName">{userName}</span>
        </div>
      </div>
    </header>
  )
}
