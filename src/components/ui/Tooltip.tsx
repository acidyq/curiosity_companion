import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  delay?: number
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Tooltip = ({
  content,
  children,
  delay = 200,
  position = 'top',
  className = '',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  let timeout: ReturnType<typeof setTimeout> | undefined

  const showTooltip = () => {
    timeout = setTimeout(() => setIsVisible(true), delay)
  }

  const hideTooltip = () => {
    if (timeout) clearTimeout(timeout)
    setIsVisible(false)
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
    }
  }

  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800'
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800'
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800'
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800'
    }
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getPositionStyles()} pointer-events-none`}
          >
            <div className="relative">
              <div className="bg-slate-800 text-white text-sm rounded-lg px-4 py-2.5 shadow-xl border border-white/10 max-w-md">
                {content}
              </div>
              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-4 ${getArrowStyles()}`}
                style={{ borderWidth: '6px' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
