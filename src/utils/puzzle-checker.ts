/**
 * Puzzle Checker Framework
 * Provides verification and feedback for puzzle solutions
 */

export interface CheckResult {
  isCorrect: boolean
  isPartial?: boolean
  score?: number // 0-100
  feedback: {
    summary: string
    details: string[]
    hints?: string[]
    nextSteps?: string[]
  }
  achievements?: string[]
}

export interface PuzzleChecker<T> {
  check: (state: T) => CheckResult
  getProgress: (state: T) => number // 0-100
  isComplete: (state: T) => boolean
}

/**
 * Helper to create detailed feedback messages
 */
export const createFeedback = (
  _isCorrect: boolean,
  summary: string,
  details: string[],
  hints?: string[],
  nextSteps?: string[]
): CheckResult['feedback'] => ({
  summary,
  details,
  hints,
  nextSteps,
})

/**
 * Check if two regions are adjacent in a planar graph
 */
export const areRegionsAdjacent = (
  region1: number,
  region2: number,
  adjacencyMap: Record<number, number[]>
): boolean => {
  return adjacencyMap[region1]?.includes(region2) ?? false
}

/**
 * Validate graph coloring (for Four-Color Theorem)
 */
export const isValidColoring = (
  colors: Record<number, number>,
  adjacencyMap: Record<number, number[]>
): boolean => {
  for (const [region, color] of Object.entries(colors)) {
    const regionId = parseInt(region)
    const neighbors = adjacencyMap[regionId] || []

    for (const neighbor of neighbors) {
      if (colors[neighbor] !== undefined && colors[neighbor] === color) {
        return false
      }
    }
  }
  return true
}

/**
 * Check if a knight's move is valid
 */
export const isValidKnightMove = (
  from: [number, number],
  to: [number, number]
): boolean => {
  const dx = Math.abs(to[0] - from[0])
  const dy = Math.abs(to[1] - from[1])
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2)
}

/**
 * Check if a path is a valid knight's tour
 */
export const isValidKnightsTour = (
  path: Array<[number, number]>,
  boardSize: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check if all squares are visited
  if (path.length !== boardSize * boardSize) {
    errors.push(`Only ${path.length} of ${boardSize * boardSize} squares visited`)
  }

  // Check for duplicates
  const visited = new Set<string>()
  for (const [row, col] of path) {
    const key = `${row},${col}`
    if (visited.has(key)) {
      errors.push(`Square (${row}, ${col}) visited more than once`)
    }
    visited.add(key)
  }

  // Check if all moves are valid knight moves
  for (let i = 0; i < path.length - 1; i++) {
    if (!isValidKnightMove(path[i], path[i + 1])) {
      errors.push(`Invalid knight move from (${path[i]}) to (${path[i + 1]})`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if a tour is closed (returns to start)
 */
export const isClosedTour = (path: Array<[number, number]>): boolean => {
  if (path.length < 2) return false
  return isValidKnightMove(path[path.length - 1], path[0])
}

/**
 * Calculate tour efficiency (how optimal the path is)
 */
export const calculateTourEfficiency = (
  path: Array<[number, number]>,
  boardSize: number
): number => {
  const maxSquares = boardSize * boardSize
  const visitedSquares = path.length
  return (visitedSquares / maxSquares) * 100
}
