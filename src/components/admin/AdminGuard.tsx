import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdminDemoMode, isAdminLoggedIn } from '../../lib/adminAuth'
import { getStoredToken } from '../../lib/api'

type AdminGuardProps = {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation()

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  const hasApiSession = Boolean(getStoredToken())
  if (!hasApiSession && !isAdminDemoMode()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
