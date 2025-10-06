import { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Toggle = ({ label, className, checked, ...props }: ToggleProps) => {
  return (
    <label className={clsx('flex items-center cursor-pointer', className)}>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} {...props} />
        <div
          className={clsx(
            'block w-14 h-8 rounded-full transition-colors',
            checked ? 'bg-cabinet-blue' : 'bg-slate-700'
          )}
        />
        <div
          className={clsx(
            'absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform',
            checked && 'transform translate-x-6'
          )}
        />
      </div>
      {label && <span className="ml-3 text-sm font-medium text-slate-300">{label}</span>}
    </label>
  )
}
