import { Outlet } from 'react-router-dom'
import { ShellNavProvider } from '../../context/ShellNavContext'
import { MobileNavDrawer } from '../dashboard/MobileNavDrawer'
import { Sidebar } from '../dashboard/Sidebar'
import { TopBar } from '../dashboard/TopBar'
import '../dashboard/dashboard.css'

export function AppShell() {
  return (
    <ShellNavProvider>
      <div className="appShellRoot">
        <div className="shell">
          <Sidebar />
          <div className="mainColumn">
            <TopBar userName="Anshuman Raj" userInitials="AR" />
            <main className="dashboardMain">
              <div className="dashboardInner">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
        <MobileNavDrawer />
      </div>
    </ShellNavProvider>
  )
}
