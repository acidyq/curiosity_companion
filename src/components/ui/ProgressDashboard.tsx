import { motion } from 'framer-motion'
import { useProgressStore } from '@/store/progressStore'

export const ProgressDashboard = () => {
  const { stats, streak, getProgressPercentage } = useProgressStore()
  const progressPercentage = getProgressPercentage()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6"
    >
      {/* Level & XP */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cabinet-blue to-cabinet-purple flex items-center justify-center font-bold text-lg">
            {stats.level}
          </div>
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 22}
              initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 22 * (1 - progressPercentage / 100)
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold">Level {stats.level}</div>
          <div className="text-xs text-slate-400">{Math.floor(progressPercentage)}% to next</div>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
        <span className="text-2xl">🔥</span>
        <div>
          <div className="text-sm font-bold text-orange-400">{streak.currentStreak} day streak</div>
          <div className="text-xs text-slate-400">Best: {streak.longestStreak}</div>
        </div>
      </div>

      {/* XP Count */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5">
        <span className="text-xl">⭐</span>
        <div>
          <div className="text-sm font-bold text-cabinet-yellow">{stats.totalXP.toLocaleString()} XP</div>
          <div className="text-xs text-slate-400">{stats.modulesCompleted} modules</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5">
        <span className="text-xl">🏆</span>
        <div>
          <div className="text-sm font-bold text-cabinet-purple">{stats.achievementsUnlocked}</div>
          <div className="text-xs text-slate-400">achievements</div>
        </div>
      </div>
    </motion.div>
  )
}
