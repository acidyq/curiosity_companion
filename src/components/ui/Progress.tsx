import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  showLabel?: boolean
}

export const Progress = ({ value, showLabel = false, className, ...props }: ProgressProps) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={clsx('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm text-slate-400">
          <span>Progress</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cabinet-blue to-cabinet-purple transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
