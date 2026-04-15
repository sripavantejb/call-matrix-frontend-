import { useEffect, useRef } from 'react'
import type { AgentToolKind } from '../../../types/agentTools'
import { TOOL_ADD_MENU } from '../../../types/agentTools'
import '../agents.css'

type ToolAddMenuProps = {
  open: boolean
  onClose: () => void
  onPick: (kind: AgentToolKind) => void
}

export function ToolAddMenu({ open, onClose, onPick }: ToolAddMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="toolAddDropdown" ref={ref} role="menu">
      {TOOL_ADD_MENU.map(({ kind, label }) => (
        <button
          key={kind}
          type="button"
          role="menuitem"
          className="toolAddItem"
          onClick={() => {
            onPick(kind)
            onClose()
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
