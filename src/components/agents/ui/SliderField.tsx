type SliderFieldProps = {
  label: string
  valueLabel: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (v: number) => void
  minLabel?: string
  maxLabel?: string
  showEnds?: boolean
}

export function SliderField({
  label,
  valueLabel,
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel,
  maxLabel,
  showEnds = true,
}: SliderFieldProps) {
  return (
    <div className="sliderField">
      <div className="sliderTop">
        <span className="sliderLabel">{label}</span>
        <span className="sliderValue">{valueLabel}</span>
      </div>
      <input
        type="range"
        className="rangeInput"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {showEnds && (minLabel || maxLabel) ? (
        <div className="sliderEnds">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  )
}
