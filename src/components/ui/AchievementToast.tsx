import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useProgressStore, Achievement } from '@/store/progressStore'

interface ToastNotification {
  achievement: Achievement
  id: string
}

export const AchievementToast = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([])
  const { achievements, unlockedAchievements } = useProgressStore()

  // Listen for new achievement unlocks
  useEffect(() => {
    const unlockedIds = new Set(unlockedAchievements)
    const recentlyUnlocked = achievements.filter(
      a => unlockedIds.has(a.id) && a.unlockedAt
    ).sort((a, b) => {
      const timeA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0
      const timeB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0
      return timeB - timeA
    })

    if (recentlyUnlocked.length > 0) {
      const latest = recentlyUnlocked[0]
      const now = new Date()
      const unlockedTime = latest.unlockedAt ? new Date(latest.unlockedAt).getTime() : 0

      // Only show if unlocked in the last 5 seconds
      if (now.getTime() - unlockedTime < 5000) {
        setNotifications(prev => {
          // Don't show duplicate
          if (prev.some(n => n.achievement.id === latest.id)) {
            return prev
          }
          return [...prev, { achievement: latest, id: `${latest.id}-${Date.now()}` }]
        })
      }
    }
  }, [achievements, unlockedAchievements])

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-slate-500 to-slate-600'
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-yellow-500 to-orange-600'
    }
  }

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-slate-500/50'
      case 'rare': return 'shadow-blue-500/50'
      case 'epic': return 'shadow-purple-500/50'
      case 'legendary': return 'shadow-yellow-500/50'
    }
  }

  return (
    <div className="fixed top-24 right-8 z-50 space-y-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="pointer-events-auto"
          >
            <motion.div
              className={`
                relative overflow-hidden rounded-xl
                bg-gradient-to-br ${getRarityColor(notification.achievement.rarity)}
                shadow-2xl ${getRarityGlow(notification.achievement.rarity)}
                border border-white/20
                p-4 min-w-[320px]
              `}
              animate={{
                boxShadow: [
                  '0 20px 60px rgba(0,0,0,0.3)',
                  '0 20px 80px rgba(0,0,0,0.4)',
                  '0 20px 60px rgba(0,0,0,0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Sparkle effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              <div className="relative flex items-start gap-3">
                <motion.div
                  className="text-4xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.2
                  }}
                >
                  {notification.achievement.icon}
                </motion.div>

                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
                      Achievement Unlocked!
                    </div>
                    <div className="font-bold text-white text-lg">
                      {notification.achievement.title}
                    </div>
                    <div className="text-sm text-white/90 mt-1">
                      {notification.achievement.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-yellow-300">
                        +{notification.achievement.xpReward} XP
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 uppercase font-bold">
                        {notification.achievement.rarity}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
