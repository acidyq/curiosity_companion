import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Achievement types inspired by Brilliant.org
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
  xpReward: number
}

export interface ModuleProgress {
  moduleId: string
  completed: boolean
  completedAt?: Date
  attempts: number
  timeSpent: number // in seconds
  hintsUsed: number
  xpEarned: number
}

export interface DailyStreak {
  currentStreak: number
  longestStreak: number
  lastVisit: Date
  totalDaysActive: number
}

export interface UserStats {
  totalXP: number
  level: number
  modulesCompleted: number
  perfectScores: number // completed without hints
  totalTimeSpent: number
  achievementsUnlocked: number
}

interface ProgressState {
  // User stats
  stats: UserStats
  streak: DailyStreak

  // Module progress
  moduleProgress: Record<string, ModuleProgress>

  // Achievements
  achievements: Achievement[]
  unlockedAchievements: string[]

  // Actions
  completeModule: (moduleId: string, hintsUsed: number, timeSpent: number) => void
  startModule: (moduleId: string) => void
  addAttempt: (moduleId: string) => void
  checkAndUpdateStreak: () => void
  unlockAchievement: (achievementId: string) => void
  addXP: (amount: number) => void

  // Getters
  getLevel: () => number
  getXPForNextLevel: () => number
  getProgressPercentage: () => number
  isModuleCompleted: (moduleId: string) => boolean
}

// XP calculation: Level = floor(sqrt(XP / 100))
// This means: Level 1 = 100 XP, Level 2 = 400 XP, Level 3 = 900 XP, etc.
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100))
}

const getXPForLevel = (level: number): number => {
  return level * level * 100
}

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Steps',
    description: 'Complete your first module',
    icon: '🎯',
    rarity: 'common',
    xpReward: 50
  },
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    rarity: 'common',
    xpReward: 100
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 250
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '💫',
    rarity: 'epic',
    xpReward: 1000
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 5 modules without using hints',
    icon: '💎',
    rarity: 'rare',
    xpReward: 300
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a module in under 5 minutes',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 200
  },
  {
    id: 'completionist-10',
    title: 'Curious Mind',
    description: 'Complete 10 modules',
    icon: '🧠',
    rarity: 'rare',
    xpReward: 500
  },
  {
    id: 'level-5',
    title: 'Adept Learner',
    description: 'Reach level 5',
    icon: '⭐',
    rarity: 'rare',
    xpReward: 300
  },
  {
    id: 'level-10',
    title: 'Mathematical Maestro',
    description: 'Reach level 10',
    icon: '🏆',
    rarity: 'epic',
    xpReward: 1000
  },
  {
    id: 'all-modules',
    title: 'Cabinet Explorer',
    description: 'Complete all available modules',
    icon: '🎓',
    rarity: 'legendary',
    xpReward: 2000
  }
]

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      stats: {
        totalXP: 0,
        level: 0,
        modulesCompleted: 0,
        perfectScores: 0,
        totalTimeSpent: 0,
        achievementsUnlocked: 0
      },

      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: new Date(),
        totalDaysActive: 0
      },

      moduleProgress: {},
      achievements: defaultAchievements,
      unlockedAchievements: [],

      completeModule: (moduleId: string, hintsUsed: number, timeSpent: number) => {
        const state = get()
        const existing = state.moduleProgress[moduleId]

        // Check if this is a new completion
        const isNewCompletion = !existing?.completed
        const isPerfect = hintsUsed === 0

        // Calculate current completion score (100 base + bonuses)
        let currentCompletionXP = 100
        if (isPerfect) currentCompletionXP += 50
        if (timeSpent < 600) currentCompletionXP += 25

        // Determine if user improved and how much XP to award
        let xpToAward = 0
        let xpEarned = currentCompletionXP // Track best XP for this module

        if (isNewCompletion) {
          // First time completing this module - award full XP
          xpToAward = currentCompletionXP
          xpEarned = currentCompletionXP
        } else {
          // Already completed before - check for improvement
          const previousBestXP = existing.xpEarned || 0

          if (currentCompletionXP > previousBestXP) {
            // Improved! Award the difference
            xpToAward = currentCompletionXP - previousBestXP
            xpEarned = currentCompletionXP // Update to new best
          } else {
            // No improvement - no XP awarded
            xpToAward = 0
            xpEarned = previousBestXP // Keep previous best
          }
        }

        set(state => {
          const newProgress = {
            ...state.moduleProgress,
            [moduleId]: {
              moduleId,
              completed: true,
              completedAt: new Date(),
              attempts: (existing?.attempts || 0) + 1,
              timeSpent: (existing?.timeSpent || 0) + timeSpent,
              hintsUsed, // Store current attempt's hints (not cumulative)
              xpEarned // Store the best XP earned for this module
            }
          }

          const newTotalXP = state.stats.totalXP + xpToAward
          const newLevel = calculateLevel(newTotalXP)

          const newStats = {
            ...state.stats,
            totalXP: newTotalXP,
            level: newLevel,
            modulesCompleted: isNewCompletion ? state.stats.modulesCompleted + 1 : state.stats.modulesCompleted,
            perfectScores: (isPerfect && isNewCompletion) ? state.stats.perfectScores + 1 : state.stats.perfectScores,
            totalTimeSpent: state.stats.totalTimeSpent + timeSpent
          }

          return {
            moduleProgress: newProgress,
            stats: newStats
          }
        })

        // Check for achievements
        setTimeout(() => {
          get().checkAchievements()
        }, 100)
      },

      startModule: (moduleId: string) => {
        set(state => {
          const existing = state.moduleProgress[moduleId]
          if (existing) return state

          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: {
                moduleId,
                completed: false,
                attempts: 0,
                timeSpent: 0,
                hintsUsed: 0,
                xpEarned: 0
              }
            }
          }
        })
      },

      addAttempt: (moduleId: string) => {
        set(state => ({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: {
              ...state.moduleProgress[moduleId],
              attempts: (state.moduleProgress[moduleId]?.attempts || 0) + 1
            }
          }
        }))
      },

      checkAndUpdateStreak: () => {
        const state = get()
        const now = new Date()
        const lastVisit = new Date(state.streak.lastVisit)

        // Reset to start of day for comparison
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const lastVisitDay = new Date(lastVisit.getFullYear(), lastVisit.getMonth(), lastVisit.getDate())

        const daysDiff = Math.floor((today.getTime() - lastVisitDay.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff === 0) {
          // Same day, no change
          return
        } else if (daysDiff === 1) {
          // Next day, increment streak
          set(state => ({
            streak: {
              ...state.streak,
              currentStreak: state.streak.currentStreak + 1,
              longestStreak: Math.max(state.streak.longestStreak, state.streak.currentStreak + 1),
              lastVisit: now,
              totalDaysActive: state.streak.totalDaysActive + 1
            }
          }))
        } else {
          // Streak broken
          set(state => ({
            streak: {
              ...state.streak,
              currentStreak: 1,
              lastVisit: now,
              totalDaysActive: state.streak.totalDaysActive + 1
            }
          }))
        }

        // Check for streak achievements
        setTimeout(() => {
          get().checkAchievements()
        }, 100)
      },

      unlockAchievement: (achievementId: string) => {
        set(state => {
          if (state.unlockedAchievements.includes(achievementId)) {
            return state
          }

          const achievement = state.achievements.find(a => a.id === achievementId)
          if (!achievement) return state

          const updatedAchievements = state.achievements.map(a =>
            a.id === achievementId ? { ...a, unlockedAt: new Date() } : a
          )

          return {
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
            achievements: updatedAchievements,
            stats: {
              ...state.stats,
              totalXP: state.stats.totalXP + achievement.xpReward,
              achievementsUnlocked: state.stats.achievementsUnlocked + 1
            }
          }
        })
      },

      addXP: (amount: number) => {
        set(state => {
          const newTotalXP = state.stats.totalXP + amount
          const newLevel = calculateLevel(newTotalXP)

          return {
            stats: {
              ...state.stats,
              totalXP: newTotalXP,
              level: newLevel
            }
          }
        })
      },

      getLevel: () => {
        return get().stats.level
      },

      getXPForNextLevel: () => {
        const currentLevel = get().stats.level
        return getXPForLevel(currentLevel + 1)
      },

      getProgressPercentage: () => {
        const state = get()
        const currentLevelXP = getXPForLevel(state.stats.level)
        const nextLevelXP = getXPForLevel(state.stats.level + 1)
        const xpInCurrentLevel = state.stats.totalXP - currentLevelXP
        const xpNeededForLevel = nextLevelXP - currentLevelXP

        return (xpInCurrentLevel / xpNeededForLevel) * 100
      },

      isModuleCompleted: (moduleId: string) => {
        return get().moduleProgress[moduleId]?.completed || false
      },

      // Internal method to check achievements
      checkAchievements: () => {
        const state = get()

        // First module
        if (state.stats.modulesCompleted >= 1 && !state.unlockedAchievements.includes('first-step')) {
          get().unlockAchievement('first-step')
        }

        // Streaks
        if (state.streak.currentStreak >= 3 && !state.unlockedAchievements.includes('streak-3')) {
          get().unlockAchievement('streak-3')
        }
        if (state.streak.currentStreak >= 7 && !state.unlockedAchievements.includes('streak-7')) {
          get().unlockAchievement('streak-7')
        }
        if (state.streak.currentStreak >= 30 && !state.unlockedAchievements.includes('streak-30')) {
          get().unlockAchievement('streak-30')
        }

        // Perfect scores
        if (state.stats.perfectScores >= 5 && !state.unlockedAchievements.includes('perfectionist')) {
          get().unlockAchievement('perfectionist')
        }

        // Completionist
        if (state.stats.modulesCompleted >= 10 && !state.unlockedAchievements.includes('completionist-10')) {
          get().unlockAchievement('completionist-10')
        }

        // Levels
        if (state.stats.level >= 5 && !state.unlockedAchievements.includes('level-5')) {
          get().unlockAchievement('level-5')
        }
        if (state.stats.level >= 10 && !state.unlockedAchievements.includes('level-10')) {
          get().unlockAchievement('level-10')
        }
      }
    }),
    {
      name: 'curiosity-progress',
      version: 1
    }
  )
)
