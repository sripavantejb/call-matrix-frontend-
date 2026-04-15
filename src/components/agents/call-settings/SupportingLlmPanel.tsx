import { useState } from 'react'
import { Brain } from 'lucide-react'
import { ToggleRow } from '../ui/ToggleRow'
import '../agents.css'

export function SupportingLlmPanel() {
  const [on, setOn] = useState(false)

  return (
    <div>
      <div className="csPanelHead">
        <div className="csPanelTitle">
          <Brain size={18} strokeWidth={1.75} aria-hidden />
          Supporting LLM
        </div>
        <p className="csPanelSub">Dual LLM pipeline for faster responses</p>
      </div>
      <ToggleRow label="Enable supporting LLM" checked={on} onChange={setOn} />
    </div>
  )
}
