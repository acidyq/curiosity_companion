import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckResult } from '@/utils/puzzle-checker'
import { Button } from './Button'
import { wrapGlossaryTerms } from './GlossaryTerm'
import { attachEnhancedTooltips } from './GlossaryTooltip'
import { getGlossaryEntry } from '@/utils/glossary'

interface FeedbackPanelProps {
  result: CheckResult | null
  onDismiss?: () => void
  onTryAgain?: () => void
  showActions?: boolean
}

export const FeedbackPanel = ({
  result,
  onDismiss,
  onTryAgain,
  showActions = true,
}: FeedbackPanelProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  // Attach glossary tooltips after render
  useEffect(() => {
    if (!result) return

    // Small delay to ensure dangerouslySetInnerHTML has rendered
    const timer = setTimeout(() => {
      if (!contentRef.current) return

      // Attach enhanced tooltips
      const cleanup = attachEnhancedTooltips(contentRef.current, getGlossaryEntry)

      return cleanup
    }, 100) // Small delay to ensure DOM is ready

    return () => clearTimeout(timer)
  }, [result])

  if (!result) return null

  const getStatusColor = () => {
    if (result.isCorrect) return 'from-green-500 to-emerald-500'
    if (result.isPartial) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getStatusIcon = () => {
    if (result.isCorrect) return '✓'
    if (result.isPartial) return '◐'
    return '✗'
  }

  const getStatusLabel = () => {
    if (result.isCorrect) return 'Correct!'
    if (result.isPartial) return 'Partially Correct'
    return 'Not Quite'
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-panel p-6 rounded-xl border-2 border-white/20 shadow-2xl"
      >
        {/* Header with status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStatusColor()} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
            >
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold">{getStatusLabel()}</h3>
              {result.score !== undefined && (
                <p className="text-sm text-slate-400">Score: {result.score}%</p>
              )}
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="mb-4">
          <p
            className="text-slate-200 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(result.feedback.summary) }}
          />
        </div>

        {/* Detailed Feedback */}
        {result.feedback.details.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-semibold text-cabinet-blue uppercase tracking-wide">
              Details
            </h4>
            <ul className="space-y-2">
              {result.feedback.details.map((detail, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-cabinet-purple mt-1">•</span>
                  <span
                    className="text-slate-300 text-sm leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(detail) }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hints */}
        {result.feedback.hints && result.feedback.hints.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-2 flex items-center">
              <span className="mr-2">💡</span> Hints
            </h4>
            <ul className="space-y-2">
              {result.feedback.hints.map((hint, i) => (
                <li
                  key={i}
                  className="text-yellow-200/90 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(hint) }}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {result.feedback.nextSteps && result.feedback.nextSteps.length > 0 && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2 flex items-center">
              <span className="mr-2">→</span> Next Steps
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {result.feedback.nextSteps.map((step, i) => (
                <li
                  key={i}
                  className="text-blue-200/90 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(step) }}
                />
              ))}
            </ol>
          </div>
        )}

        {/* Achievements */}
        {result.achievements && result.achievements.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="mb-4 p-4 bg-gradient-to-r from-cabinet-blue/20 to-cabinet-purple/20 border border-white/20 rounded-lg"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-2 flex items-center">
              <span className="mr-2">🏆</span> Achievements Unlocked
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.achievements.map((achievement, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gradient-to-r from-cabinet-blue to-cabinet-purple rounded-full text-xs font-semibold text-white"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3 pt-4 border-t border-white/10">
            {!result.isCorrect && onTryAgain && (
              <Button onClick={onTryAgain} variant="primary" className="flex-1">
                Try Again
              </Button>
            )}
            {result.isCorrect && (
              <Button variant="primary" className="flex-1">
                Next Module →
              </Button>
            )}
            {onDismiss && (
              <Button onClick={onDismiss} variant="ghost">
                Continue Exploring
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
