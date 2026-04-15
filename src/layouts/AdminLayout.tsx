import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from '../components/admin/AdminSidebar'
import { clearAdminSession, isAdminDemoMode } from '../lib/adminAuth'
import { clearStoredToken } from '../lib/api'
import './admin-shell.css'
import '../pages/admin/admin-layout.css'

const TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/customers': 'Customers',
  '/admin/credentials': 'Credentials',
  '/admin/agents': 'Agents',
  '/admin/campaigns': 'Campaigns',
  '/admin/calls': 'Calls',
  '/admin/analytics': 'Analytics',
  '/admin/logs': 'System logs',
  '/admin/settings': 'Settings',
}

function titleForPath(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  const base = pathname.replace(/\/$/, '')
  return TITLES[base] ?? 'Admin'
}

export function AdminLayout() {
  const location = useLocation()
  const title = titleForPath(location.pathname)

  function handleLogout() {
    clearAdminSession()
    clearStoredToken()
    window.location.href = '/admin/login'
  }

  return (
    <div className="adminControlRoot">
      <AdminSidebar />
      <div className="adminControlMain">
        <header className="adminControlHeader">
          <div>
            <h1 className="adminControlHeaderTitle">{title}</h1>
            <p className="adminControlHeaderMeta">Platform administration</p>
          </div>
          <div className="adminHeaderActions">
            <button type="button" className="btn-ghost" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>
        <div className="adminControlBody">
          {isAdminDemoMode() && (
            <p className="adminTokenHint" style={{ marginTop: 0 }}>
              <strong>Demo mode</strong> — UI only without API. Start the backend + database and sign in again
              to load live data (JWT).
            </p>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
