import { useState } from 'react'
import { Clock } from 'lucide-react'
import { SliderField } from '../ui/SliderField'
import '../agents.css'

export function InCallLimitsPanel() {
  const [maxMin, setMaxMin] = useState(5)
  const [silenceSec, setSilenceSec] = useState(5)

  return (
    <div>
      <div className="csPanelHead">
        <div className="csPanelTitle">
          <Clock size={18} strokeWidth={1.75} aria-hidden />
          In-Call Limits
        </div>
        <p className="csPanelSub">Duration and timeout controls</p>
      </div>
      <div className="fieldStack">
        <SliderField
          label="Max call duration"
          valueLabel={`${maxMin} mins`}
          min={1}
          max={120}
          step={1}
          value={maxMin}
          onChange={setMaxMin}
          minLabel="1 min"
          maxLabel="2 hrs"
        />
        <SliderField
          label="End call on silence"
          valueLabel={`${silenceSec} secs`}
          min={10}
          max={1800}
          step={5}
          value={silenceSec}
          onChange={setSilenceSec}
          minLabel="10 secs"
          maxLabel="30 mins"
        />
      </div>
    </div>
  )
}
