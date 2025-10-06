import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface CompletionCelebrationProps {
  isVisible: boolean
  xpEarned: number
  isPerfect: boolean
  isSpeedBonus: boolean
}

export const CompletionCelebration = ({
  isVisible,
  xpEarned,
  isPerfect,
  isSpeedBonus
}: CompletionCelebrationProps) => {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Trigger confetti
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: ReturnType<typeof setInterval> = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      // Show details after a delay
      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        setShowDetails(true)
      }, 500)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    } else {
      setShowDetails(false)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-br from-cabinet-blue via-cabinet-purple to-cabinet-pink p-8 rounded-2xl shadow-2xl border-4 border-white/30 pointer-events-auto max-w-md"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl text-center mb-4"
            >
              🎉
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-white mb-2"
            >
              Module Complete!
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-6"
            >
              <div className="text-5xl font-bold text-cabinet-yellow mb-2">
                +{xpEarned} XP
              </div>
            </motion.div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white/90">Base XP</span>
                    <span className="font-bold text-white">+100</span>
                  </div>

                  {isPerfect && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30"
                    >
                      <span className="text-green-300">💎 Perfect Score</span>
                      <span className="font-bold text-green-300">+50</span>
                    </motion.div>
                  )}

                  {isSpeedBonus && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between p-3 bg-blue-500/20 rounded-lg border border-blue-500/30"
                    >
                      <span className="text-blue-300">⚡ Speed Bonus</span>
                      <span className="font-bold text-blue-300">+25</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
