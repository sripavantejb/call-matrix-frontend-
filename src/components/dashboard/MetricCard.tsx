import type { LucideIcon } from 'lucide-react'
import './dashboard.css'

type MetricCardProps = {
  title: string
  value: string
  sub: string
  icon: LucideIcon
}

export function MetricCard({ title, value, sub, icon: Icon }: MetricCardProps) {
  return (
    <article
      className="metricCard"
      style={{
        background: 'var(--bg-page)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        position: 'relative',
        minHeight: '112px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}
        aria-hidden
      >
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          marginBottom: 8,
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '0.2px',
          color: 'var(--text-primary)',
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {sub}
      </p>
    </article>
  )
}
