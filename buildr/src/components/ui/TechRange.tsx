import type { InputHTMLAttributes } from 'react'

interface TechRangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'min' | 'max' | 'value' | 'onChange'> {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export function TechRange({ min, max, value, onChange, className, ...rest }: TechRangeProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className}
      style={{ ['--range-fill' as string]: `${pct}%` }}
      {...rest}
    />
  )
}
