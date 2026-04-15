import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type ShellNavContextValue = {
  navOpen: boolean
  setNavOpen: (open: boolean) => void
  toggleNav: () => void
  closeNav: () => void
}

const ShellNavContext = createContext<ShellNavContextValue | null>(null)

export function ShellNavProvider({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)

  const closeNav = useCallback(() => setNavOpen(false), [])
  const toggleNav = useCallback(() => setNavOpen((o) => !o), [])

  const value = useMemo(
    () => ({ navOpen, setNavOpen, toggleNav, closeNav }),
    [navOpen, closeNav, toggleNav],
  )

  return (
    <ShellNavContext.Provider value={value}>{children}</ShellNavContext.Provider>
  )
}

export function useShellNav() {
  const ctx = useContext(ShellNavContext)
  if (!ctx) {
    throw new Error('useShellNav must be used within ShellNavProvider')
  }
  return ctx
}
