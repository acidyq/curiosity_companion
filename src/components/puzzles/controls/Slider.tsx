import { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  showValue?: boolean
}

export const Slider = ({ label, showValue = true, className, ...props }: SliderProps) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">{label}</label>
          {showValue && (
            <span className="text-sm text-slate-400">{props.value}</span>
          )}
        </div>
      )}
      <input
        type="range"
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cabinet-blue"
        {...props}
      />
    </div>
  )
}
