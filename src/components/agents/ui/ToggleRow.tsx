import { Info } from 'lucide-react'

type ToggleRowProps = {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  id?: string
  /** Native tooltip + accessible description for an info icon beside the label */
  infoTip?: string
}

export function ToggleRow({ label, checked, onChange, id, infoTip }: ToggleRowProps) {
  const tid = id ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="toggleRow">
      <span className="toggleRowLabel">
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-midnight)' }}>
          {label}
        </span>
        {infoTip ? (
          <span className="toggleRowInfo" title={infoTip} aria-label={infoTip}>
            <Info size={14} strokeWidth={2} aria-hidden />
          </span>
        ) : null}
      </span>
      <button
        type="button"
        id={tid}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 26,
          borderRadius: 9999,
          border: 'none',
          background: checked ? 'var(--text-primary)' : 'var(--bg-subtle)',
          position: 'relative',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 22 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--bg-page)',
            transition: 'left 0.15s ease',
          }}
          aria-hidden
        />
      </button>
    </div>
  )
}
