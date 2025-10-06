import { useEffect, useRef } from 'react'
import { useProgressStore } from '@/store/progressStore'

export const useModuleCompletion = (moduleId: string) => {
  const { startModule, completeModule, isModuleCompleted } = useProgressStore()
  const startTimeRef = useRef<number>(Date.now())
  const hintsUsedRef = useRef<number>(0)

  // Start tracking when component mounts
  useEffect(() => {
    startModule(moduleId)
    startTimeRef.current = Date.now()
  }, [moduleId, startModule])

  const trackHintUsed = () => {
    hintsUsedRef.current += 1
  }

  const markComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000) // in seconds
    completeModule(moduleId, hintsUsedRef.current, timeSpent)
  }

  return {
    trackHintUsed,
    markComplete,
    isCompleted: isModuleCompleted(moduleId)
  }
}
