import { Button } from '@/components/ui/Button'

interface StepperProps {
  value: number
  min?: number
  max?: number
  step?: number
  label?: string
  onChange: (value: number) => void
}

export const Stepper = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  onChange,
}: StepperProps) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDecrement}
          disabled={value <= min}
        >
          −
        </Button>
        <span className="text-2xl font-bold min-w-[60px] text-center">{value}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          +
        </Button>
      </div>
    </div>
  )
}
