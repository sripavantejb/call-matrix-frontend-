import { useState } from 'react'
import { Zap } from 'lucide-react'
import { SliderField } from '../ui/SliderField'
import { ToggleRow } from '../ui/ToggleRow'
import '../agents.css'

export function InterruptionsPanel() {
  const [allow, setAllow] = useState(true)
  const [minWords, setMinWords] = useState(0)
  const [sens, setSens] = useState(30)

  return (
    <div>
      <div className="csPanelHead">
        <div className="csPanelTitle">
          <Zap size={18} strokeWidth={1.75} aria-hidden />
          Interruptions
        </div>
        <p className="csPanelSub">User interruption controls</p>
      </div>
      <div className="fieldStack">
        <ToggleRow label="Allow interruptions" checked={allow} onChange={setAllow} />
        <div className="toggleRow">
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-midnight)' }}>
            Min words to trigger
          </span>
          <input
            type="number"
            className="input-field"
            style={{ width: 72, padding: '8px 10px' }}
            value={minWords}
            min={0}
            onChange={(e) => setMinWords(Number(e.target.value))}
          />
        </div>
        <SliderField
          label="Interruption sensitivity"
          valueLabel={`${(sens / 100).toFixed(1)}s`}
          min={0}
          max={100}
          step={1}
          value={sens}
          onChange={setSens}
          minLabel="Instant response"
          maxLabel="Delayed response"
        />
      </div>
    </div>
  )
}
