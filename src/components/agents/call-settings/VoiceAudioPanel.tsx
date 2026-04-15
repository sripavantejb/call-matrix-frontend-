import { useState } from 'react'
import { Mic } from 'lucide-react'
import { SelectField } from '../ui/SelectField'
import { SliderField } from '../ui/SliderField'
import { ToggleRow } from '../ui/ToggleRow'
import '../agents.css'

export function VoiceAudioPanel() {
  const [noise, setNoise] = useState(true)
  const [voiceDet, setVoiceDet] = useState(true)
  const [bg, setBg] = useState('none')
  const [sens, setSens] = useState(50)

  return (
    <div>
      <div className="csPanelHead">
        <div className="csPanelTitle">
          <Mic size={18} strokeWidth={1.75} aria-hidden />
          Voice & Audio
        </div>
        <p className="csPanelSub">Audio processing and speech detection</p>
      </div>
      <div className="fieldStack">
        <ToggleRow label="Noise cancellation" checked={noise} onChange={setNoise} />
        <ToggleRow label="Voice detection" checked={voiceDet} onChange={setVoiceDet} />
        <SelectField
          label="Background audio"
          value={bg}
          onChange={setBg}
          options={[
            { value: 'none', label: 'none' },
            { value: 'office', label: 'office' },
            { value: 'nature', label: 'nature' },
          ]}
        />
        <SliderField
          label="Detection sensitivity"
          valueLabel={String(sens)}
          min={0}
          max={100}
          step={1}
          value={sens}
          onChange={setSens}
          minLabel="More sensitive"
          maxLabel="Less sensitive"
        />
      </div>
    </div>
  )
}
