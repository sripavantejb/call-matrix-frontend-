import { useState } from 'react'
import { Gauge, Zap } from 'lucide-react'
import '../agents.css'

const modes = [
  {
    id: 'fast',
    title: 'Fast',
    bolts: 4,
    sub: 'Lowest latency',
  },
  {
    id: 'medium',
    title: 'Medium',
    bolts: 3,
    sub: 'Balanced timing (0.4s - 2s delay)',
  },
  {
    id: 'slow',
    title: 'Slow',
    bolts: 1,
    sub: 'Higher quality',
  },
  {
    id: 'custom',
    title: 'Custom',
    bolts: 4,
    sub: 'Configure manually',
  },
] as const

export function ResponseTimingPanel() {
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('medium')

  return (
    <div>
      <div className="csPanelHead">
        <div className="csPanelTitle">
          <Gauge size={18} strokeWidth={1.75} aria-hidden />
          Response Timing
        </div>
        <p className="csPanelSub">
          Control how quickly the agent responds after you stop speaking.
        </p>
      </div>
      <p style={{ fontWeight: 600, margin: '0 0 12px', fontSize: 14 }}>Response mode</p>
      <div className="responseModes">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`modeCard${mode === m.id ? ' modeCardSelected' : ''}`}
            onClick={() => setMode(m.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }} aria-hidden>
              {Array.from({ length: m.bolts }).map((_, i) => (
                <Zap key={i} size={16} strokeWidth={1.75} color="var(--text-secondary)" />
              ))}
            </div>
            <div className="modeCardTitle">{m.title}</div>
            <p className="modeCardSub">{m.sub}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
