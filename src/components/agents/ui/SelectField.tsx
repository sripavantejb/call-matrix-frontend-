type Option = { value: string; label: string }

type SelectFieldProps = {
  label: string
  value: string
  options: Option[]
  onChange: (v: string) => void
  id?: string
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  id,
}: SelectFieldProps) {
  const fid = id ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div>
      <label htmlFor={fid} className="fieldLabel">
        {label}
      </label>
      <select
        id={fid}
        className="selectField"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
