import type { LucideIcon } from 'lucide-react'

type SettingsToggleRowProps = {
  icon: LucideIcon
  title: string
  description: string
  checked: boolean
  onChange: (next: boolean) => void
  switchId: string
}

export function SettingsToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  switchId,
}: SettingsToggleRowProps) {
  return (
    <div className="settingToggleCard">
      <div className="settingRowIcon" aria-hidden>
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <div className="settingRowText">
        <h3 className="settingRowTitle">{title}</h3>
        <p className="settingRowDesc">{description}</p>
      </div>
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className="settingRowSwitch"
        style={{
          background: checked ? 'var(--text-primary)' : 'var(--bg-subtle)',
        }}
        onClick={() => onChange(!checked)}
      >
        <span
          className="settingRowSwitchKnob"
          style={{ left: checked ? 21 : 3 }}
          aria-hidden
        />
      </button>
    </div>
  )
}
