import { useSyncExternalStore } from 'react'
import { chartGrayHex, chartGrayHexDark } from '../data/dashboardMock'

function subscribe(cb: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', cb)
  const obs = new MutationObserver(cb)
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return () => {
    mq.removeEventListener('change', cb)
    obs.disconnect()
  }
}

function getSnapshot(): 'light' | 'dark' {
  const t = document.documentElement.getAttribute('data-theme')
  if (t === 'dark' || t === 'light') return t
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getServerSnapshot(): 'light' {
  return 'light'
}

/** Reads resolved theme from `data-theme` (set by ThemeProvider) for chart colors. */
export function useResolvedTheme(): 'light' | 'dark' {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export type ChartThemeColors = {
  grid: string
  axis: string
  tick: string
  textPrimary: string
  tooltipBg: string
  tooltipBorder: string
  series: readonly string[]
}

export function useChartTheme(): ChartThemeColors {
  const mode = useResolvedTheme()
  const isDark = mode === 'dark'

  return {
    grid: isDark ? '#3f3f46' : '#e5e7eb',
    axis: isDark ? '#52525b' : '#e5e7eb',
    tick: isDark ? '#a1a1aa' : '#898989',
    textPrimary: isDark ? '#f4f4f5' : '#242424',
    tooltipBg: isDark ? '#27272a' : '#ffffff',
    tooltipBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(34, 42, 53, 0.08)',
    series: isDark ? chartGrayHexDark : chartGrayHex,
  }
}
