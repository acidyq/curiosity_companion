import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlossaryEntry, getGlossaryEntry } from '@/utils/glossary'
import { X, ExternalLink } from 'lucide-react'

interface GlossaryTooltipProps {
  entry: GlossaryEntry
  targetElement: HTMLElement
  onRelatedTermClick?: (term: string) => void
}

export const GlossaryTooltip = ({ entry, targetElement, onRelatedTermClick }: GlossaryTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = () => {
      setIsVisible(prev => !prev)
    }

    targetElement.addEventListener('click', handleClick)

    return () => {
      targetElement.removeEventListener('click', handleClick)
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

  const handleRelatedClick = (term: string) => {
    const relatedEntry = getGlossaryEntry(term)
    if (relatedEntry && onRelatedTermClick) {
      onRelatedTermClick(term)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={() => setIsVisible(false)}
          />

          {/* Centered tooltip */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md px-4"
          >
          <div className="relative">
            {/* Glossy card with gradient border */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              {/* Gradient accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${getCategoryColor()}`} />

              <div className="p-5">
                {/* Header with icon, term, and close button */}
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
                  <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close tooltip"
                  >
                    <X className="w-4 h-4 text-slate-400 hover:text-white" />
                  </button>
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
                      {entry.relatedTerms.map((term, idx) => {
                        const hasEntry = getGlossaryEntry(term)
                        return (
                          <button
                            key={idx}
                            onClick={() => handleRelatedClick(term)}
                            disabled={!hasEntry}
                            className={`inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-xs font-medium border border-white/10 transition-all ${
                              hasEntry
                                ? 'text-cabinet-blue hover:bg-cabinet-blue/20 hover:border-cabinet-blue/50 cursor-pointer'
                                : 'text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {term}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* External links */}
                {entry.relatedLinks && entry.relatedLinks.length > 0 && (
                  <div className="pt-3 border-t border-white/10">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400">Learn More:</span>
                      {entry.relatedLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 border border-white/10 hover:border-blue-500/50 transition-all group"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="flex-1 text-left">{link.title}</span>
                        </a>
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
          </div>
          </motion.div>
        </>
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
            onRelatedTermClick: (relatedTerm: string) => {
              // Navigate to related term by scrolling to it
              const relatedElements = containerElement.querySelectorAll(`[data-term="${relatedTerm.toLowerCase()}"]`)
              if (relatedElements.length > 0) {
                relatedElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
                // Trigger click to open the related term's tooltip
                setTimeout(() => {
                  (relatedElements[0] as HTMLElement).click()
                }, 500)
              }
            },
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
