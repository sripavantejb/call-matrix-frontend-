export const ADMIN_AUTH_KEY = 'admin-auth'

/** When set, admin UI is available without a real API JWT (local demo / offline). */
export const ADMIN_DEMO_KEY = 'admin-demo'

export function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

export function setAdminLoggedIn(value: boolean): void {
  if (value) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true')
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY)
  }
}

export function isAdminDemoMode(): boolean {
  try {
    return localStorage.getItem(ADMIN_DEMO_KEY) === 'true'
  } catch {
    return false
  }
}

export function setAdminDemoMode(value: boolean): void {
  if (value) {
    localStorage.setItem(ADMIN_DEMO_KEY, 'true')
  } else {
    localStorage.removeItem(ADMIN_DEMO_KEY)
  }
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY)
  localStorage.removeItem(ADMIN_DEMO_KEY)
}
