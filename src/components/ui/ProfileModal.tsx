import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore, Achievement } from '@/store/progressStore'
import { X, RotateCcw } from 'lucide-react'
import { useState } from 'react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { stats, streak, achievements, unlockedAchievements, moduleProgress, resetProgress } = useProgressStore()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    resetProgress()
    setShowResetConfirm(false)
    onClose()
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-slate-600 border-slate-500'
      case 'rare': return 'bg-blue-600 border-blue-500'
      case 'epic': return 'bg-purple-600 border-purple-500'
      case 'legendary': return 'bg-gradient-to-br from-yellow-500 to-orange-600 border-yellow-500'
    }
  }

  const unlockedSet = new Set(unlockedAchievements)
  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = unlockedSet.has(a.id)
    const bUnlocked = unlockedSet.has(b.id)
    if (aUnlocked && !bUnlocked) return -1
    if (!aUnlocked && bUnlocked) return 1
    return 0
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-8 z-50 overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="relative p-8 bg-gradient-to-br from-cabinet-blue/20 to-cabinet-purple/20 border-b border-white/10">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    title="Reset Progress"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cabinet-blue to-cabinet-purple flex items-center justify-center text-4xl font-bold">
                    {stats.level}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold font-display mb-2">Your Progress</h2>
                    <div className="flex items-center gap-6 text-sm text-slate-300">
                      <span>⭐ {stats.totalXP.toLocaleString()} XP</span>
                      <span>📚 {stats.modulesCompleted} modules completed</span>
                      <span>🏆 {stats.achievementsUnlocked} achievements</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 gap-8">
                  {/* Stats Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Statistics</h3>
                      <div className="space-y-3">
                        <StatCard
                          icon="🔥"
                          label="Current Streak"
                          value={`${streak.currentStreak} days`}
                          detail={`Best: ${streak.longestStreak} days`}
                        />
                        <StatCard
                          icon="💎"
                          label="Perfect Scores"
                          value={stats.perfectScores.toString()}
                          detail="No hints used"
                        />
                        <StatCard
                          icon="⏱️"
                          label="Time Spent Learning"
                          value={formatTime(stats.totalTimeSpent)}
                          detail={`${streak.totalDaysActive} days active`}
                        />
                        <StatCard
                          icon="📊"
                          label="Average Score"
                          value={calculateAverageScore(moduleProgress)}
                          detail="Based on completed modules"
                        />
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                      <div className="space-y-2">
                        {Object.values(moduleProgress)
                          .filter(p => p.completed)
                          .sort((a, b) => {
                            const dateA = a.completedAt?.getTime() || 0
                            const dateB = b.completedAt?.getTime() || 0
                            return dateB - dateA
                          })
                          .slice(0, 5)
                          .map(progress => (
                            <div
                              key={progress.moduleId}
                              className="p-3 rounded-lg bg-white/5 border border-white/5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">{progress.moduleId}</div>
                                <div className="text-xs text-cabinet-yellow">+{progress.xpEarned} XP</div>
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {progress.completedAt && formatDate(progress.completedAt)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Achievements Column */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Achievements ({stats.achievementsUnlocked}/{achievements.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {sortedAchievements.map(achievement => {
                        const isUnlocked = unlockedSet.has(achievement.id)
                        return (
                          <motion.div
                            key={achievement.id}
                            whileHover={isUnlocked ? { scale: 1.05 } : {}}
                            className={`
                              relative p-4 rounded-xl border-2
                              ${isUnlocked
                                ? getRarityColor(achievement.rarity)
                                : 'bg-slate-800/50 border-slate-700 opacity-50'
                              }
                            `}
                          >
                            {isUnlocked && (
                              <motion.div
                                className="absolute inset-0 rounded-xl"
                                animate={{
                                  boxShadow: [
                                    '0 0 20px rgba(139, 92, 246, 0.3)',
                                    '0 0 40px rgba(139, 92, 246, 0.5)',
                                    '0 0 20px rgba(139, 92, 246, 0.3)',
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                            <div className="relative">
                              <div className="text-3xl mb-2">{achievement.icon}</div>
                              <div className="font-bold text-sm mb-1">{achievement.title}</div>
                              <div className="text-xs text-slate-300 mb-2">
                                {achievement.description}
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-cabinet-yellow">+{achievement.xpReward} XP</span>
                                {isUnlocked && achievement.unlockedAt && (
                                  <span className="text-slate-400">
                                    ✓ {formatDate(achievement.unlockedAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reset Confirmation Dialog */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowResetConfirm(false)}
                />

                <div className="relative bg-slate-900 border border-red-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-2xl font-bold mb-2">Reset All Progress?</h3>
                    <p className="text-slate-300">
                      This will permanently delete all your XP, achievements, streaks, and module progress. This action cannot be undone.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-semibold"
                    >
                      Reset Everything
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

const StatCard = ({ icon, label, value, detail }: {
  icon: string
  label: string
  value: string
  detail: string
}) => (
  <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3">
    <div className="text-2xl">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-slate-500">{detail}</div>
    </div>
  </div>
)

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return new Date(date).toLocaleDateString()
}

const calculateAverageScore = (moduleProgress: Record<string, any>): string => {
  const completed = Object.values(moduleProgress).filter(p => p.completed)
  if (completed.length === 0) return '0%'

  const totalScore = completed.reduce((sum, p) => {
    // Calculate score based on hints used (fewer hints = higher score)
    const score = Math.max(0, 100 - (p.hintsUsed * 10))
    return sum + score
  }, 0)

  return `${Math.round(totalScore / completed.length)}%`
}
