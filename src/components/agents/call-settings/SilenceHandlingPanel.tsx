import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { SliderField } from '../ui/SliderField'
import { ToggleRow } from '../ui/ToggleRow'
import '../agents.css'

export function SilenceHandlingPanel() {
  const [nudgeSec, setNudgeSec] = useState(8)
  const [staticMsg, setStaticMsg] = useState(true)
  const [message, setMessage] = useState(
    'Is my voice audible clearly?',
  )

  return (
    <div>
      <div className="csPanelHead">
        <div className="csPanelTitle">
          <Volume2 size={18} strokeWidth={1.75} aria-hidden />
          Silence Handling
        </div>
        <p className="csPanelSub">Nudges and silence messages</p>
      </div>
      <div className="fieldStack">
        <SliderField
          label="Nudge user on silence"
          valueLabel={`${nudgeSec} secs`}
          min={1}
          max={60}
          step={1}
          value={nudgeSec}
          onChange={setNudgeSec}
          minLabel="1 sec"
          maxLabel="60 secs"
        />
        <ToggleRow
          label="Use static silence message"
          checked={staticMsg}
          onChange={setStaticMsg}
        />
        <div>
          <label className="fieldLabel" htmlFor="silence-msg">
            Silence message
          </label>
          <textarea
            id="silence-msg"
            className="textarea-field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
