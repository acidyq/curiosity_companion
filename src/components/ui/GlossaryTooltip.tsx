import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlossaryEntry } from '@/utils/glossary'

interface GlossaryTooltipProps {
  entry: GlossaryEntry
  targetElement: HTMLElement
}

export const GlossaryTooltip = ({ entry, targetElement }: GlossaryTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top')
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsVisible(true)
      updatePosition()
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect()
      const tooltipHeight = 200 // Estimated max height
      const viewportHeight = window.innerHeight
      const spaceAbove = rect.top
      const spaceBelow = viewportHeight - rect.bottom

      // Determine if tooltip should be above or below
      const shouldPlaceBelow = spaceAbove < tooltipHeight && spaceBelow > spaceAbove

      setPlacement(shouldPlaceBelow ? 'bottom' : 'top')

      // Calculate horizontal position (centered, but constrained to viewport)
      const tooltipWidth = 400 // max-w-md in pixels
      let left = rect.left + rect.width / 2 - tooltipWidth / 2

      // Prevent overflow on left
      if (left < 16) left = 16

      // Prevent overflow on right
      if (left + tooltipWidth > window.innerWidth - 16) {
        left = window.innerWidth - tooltipWidth - 16
      }

      const top = shouldPlaceBelow
        ? rect.bottom + 12
        : rect.top - 12

      setPosition({ top, left })
    }

    targetElement.addEventListener('mouseenter', handleMouseEnter)
    targetElement.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      targetElement.removeEventListener('mouseenter', handleMouseEnter)
      targetElement.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [targetElement])

  const getCategoryIcon = () => {
    switch (entry.category) {
      case 'graph-theory':
        return '🔗'
      case 'topology':
        return '🌀'
      case 'number-theory':
        return '🔢'
      case 'geometry':
        return '📐'
      default:
        return '📚'
    }
  }

  const getCategoryColor = () => {
    switch (entry.category) {
      case 'graph-theory':
        return 'from-blue-500 to-cyan-500'
      case 'topology':
        return 'from-purple-500 to-pink-500'
      case 'number-theory':
        return 'from-green-500 to-emerald-500'
      case 'geometry':
        return 'from-orange-500 to-yellow-500'
      default:
        return 'from-slate-500 to-slate-600'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.92, y: placement === 'top' ? 8 : -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: placement === 'top' ? 8 : -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: placement === 'top' ? position.top : 'auto',
            bottom: placement === 'bottom' ? `calc(100vh - ${position.top}px)` : 'auto',
            left: position.left,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          className="w-full max-w-md"
        >
          <div className="relative">
            {/* Glossy card with gradient border */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              {/* Gradient accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${getCategoryColor()}`} />

              <div className="p-5">
                {/* Header with icon and term */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl flex-shrink-0 mt-0.5">
                    {getCategoryIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-white mb-0.5 leading-tight">
                      {entry.term}
                    </h4>
                    {entry.category && (
                      <div className="text-xs font-medium text-slate-400 capitalize">
                        {entry.category.replace('-', ' ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Definition */}
                <p className="text-slate-200 text-sm leading-relaxed mb-3">
                  {entry.definition}
                </p>

                {/* Related terms */}
                {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-400">Related:</span>
                      {entry.relatedTerms.map((term, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-cabinet-blue border border-white/10"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Subtle glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor()} opacity-5 pointer-events-none`}
              />
            </div>

            {/* Arrow indicator */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${
                placement === 'top' ? '-bottom-2' : '-top-2'
              }`}
            >
              <div
                className={`w-4 h-4 bg-slate-800 border-white/10 ${
                  placement === 'top'
                    ? 'border-b border-r'
                    : 'border-t border-l'
                } transform rotate-45`}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Helper function to attach enhanced tooltips to glossary terms
export const attachEnhancedTooltips = (
  containerElement: HTMLElement,
  getEntry: (term: string) => GlossaryEntry | undefined
) => {
  const glossarySpans = containerElement.querySelectorAll('.glossary-term')
  const tooltipRoots: Array<{ container: HTMLDivElement; root: any }> = []

  // Import React dependencies
  import('react-dom/client').then(({ createRoot }) => {
    import('react').then((React) => {
      glossarySpans.forEach(span => {
        // Skip if tooltip already attached
        if (span.hasAttribute('data-tooltip-attached')) return

        const term = span.getAttribute('data-term')
        if (!term) return

        const entry = getEntry(term)
        if (!entry) return

        // Mark as attached
        span.setAttribute('data-tooltip-attached', 'true')

        // Create a container for the React tooltip
        const tooltipContainer = document.createElement('div')
        tooltipContainer.className = 'glossary-tooltip-portal'
        document.body.appendChild(tooltipContainer)

        // Render the React component
        const root = createRoot(tooltipContainer)
        root.render(
          React.createElement(GlossaryTooltip, {
            entry,
            targetElement: span as HTMLElement,
          })
        )

        tooltipRoots.push({ container: tooltipContainer, root })
      })
    })
  })

  // Return cleanup function
  return () => {
    tooltipRoots.forEach(({ container, root }) => {
      if (root) root.unmount()
      container.remove()
    })
  }
}
