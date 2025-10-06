import { useState } from 'react'
import { ModuleDefinition } from '../types'
import { SvgStage } from '@/components/visuals/SvgStage'
import { Button } from '@/components/ui/Button'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { CheckResult, isValidKnightsTour, isClosedTour } from '@/utils/puzzle-checker'

// Interactive Knight's Tour Component
const KnightsTourInteractive = () => {
  const boardSize = 5
  const cellSize = 80
  const [path, setPath] = useState<Array<[number, number]>>([])
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)

  const isValidMove = (from: [number, number], to: [number, number]): boolean => {
    const dx = Math.abs(to[0] - from[0])
    const dy = Math.abs(to[1] - from[1])
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2)
  }

  const handleCellClick = (row: number, col: number) => {
    const pos: [number, number] = [row, col]

    // Check if cell already visited
    if (path.some(([r, c]) => r === row && c === col)) {
      return
    }

    // First move
    if (!currentPos) {
      setPath([pos])
      setCurrentPos(pos)
      setCheckResult(null)
      return
    }

    // Validate knight's move
    if (isValidMove(currentPos, pos)) {
      setPath([...path, pos])
      setCurrentPos(pos)
      setCheckResult(null)
    }
  }

  const resetBoard = () => {
    setPath([])
    setCurrentPos(null)
    setCheckResult(null)
  }

  const checkSolution = () => {
    const totalSquares = boardSize * boardSize
    const { valid, errors } = isValidKnightsTour(path, boardSize)

    if (path.length === 0) {
      setCheckResult({
        isCorrect: false,
        score: 0,
        feedback: {
          summary: 'No moves yet! Click any square to start your knight\'s tour.',
          details: ['The knight can move in an L-shape: 2 squares in one direction and 1 square perpendicular.'],
          nextSteps: ['Click any square on the board to begin'],
        },
      })
      return
    }

    if (valid && path.length === totalSquares) {
      const isClosed = isClosedTour(path)
      const achievements = ['Knight\'s Tour Master']
      if (isClosed) achievements.push('Closed Tour Champion')

      setCheckResult({
        isCorrect: true,
        score: 100,
        feedback: {
          summary: isClosed
            ? 'Outstanding! You\'ve completed a CLOSED knight\'s tour - the knight can return to the starting square!'
            : 'Excellent! You\'ve successfully completed a knight\'s tour, visiting all squares exactly once!',
          details: [
            `Visited all ${totalSquares} squares`,
            'All moves follow valid knight movement (L-shaped)',
            'No square visited more than once',
            isClosed
              ? 'The tour is closed - forms a complete loop back to the start!'
              : 'The tour is open - doesn\'t return to the starting square',
          ],
          nextSteps: isClosed
            ? [
                'Amazing work! Closed tours are much harder to find.',
                'Try finding a different closed tour from a different starting position',
              ]
            : [
                'Great job completing an open tour!',
                'Challenge: Can you find a closed tour that returns to the starting square?',
                'Try starting from a different position to explore different paths',
              ],
        },
        achievements,
      })
    } else if (path.length < totalSquares) {
      const progress = Math.round((path.length / totalSquares) * 100)
      const remainingSquares = totalSquares - path.length

      setCheckResult({
        isCorrect: false,
        isPartial: path.length > totalSquares / 2,
        score: progress,
        feedback: {
          summary: `Good progress! You've visited ${path.length} of ${totalSquares} squares.`,
          details: [
            `${remainingSquares} square${remainingSquares > 1 ? 's' : ''} remaining`,
            `Current progress: ${progress}%`,
            path.length > totalSquares / 2
              ? 'You\'re over halfway there!'
              : 'Keep exploring different paths',
          ],
          hints: [
            'Try to avoid getting stuck in corners - they have fewer escape routes',
            'Warnsdorf\'s rule: Move to squares that have the fewest onward moves',
            'If you get stuck, reset and try starting from a different position',
          ],
          nextSteps: [
            'Continue exploring the board',
            'Watch out for isolated squares that might become unreachable',
          ],
        },
      })
    } else {
      // Has errors
      setCheckResult({
        isCorrect: false,
        score: 40,
        feedback: {
          summary: 'The tour has some issues that need fixing.',
          details: errors.slice(0, 3),
          hints: [
            'The knight moves in an L-shape: 2 squares in one direction, 1 perpendicular',
            'Each square should be visited exactly once',
          ],
          nextSteps: [
            'Reset the board and try again',
            'Plan your route more carefully to avoid revisiting squares',
          ],
        },
      })
    }
  }

  const getCellNumber = (row: number, col: number): number => {
    const index = path.findIndex(([r, c]) => r === row && c === col)
    return index >= 0 ? index + 1 : 0
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="text-center">
        <p className="text-slate-300 mb-2">
          Click squares to move the knight. Can you visit all {boardSize * boardSize} squares?
        </p>
        <p className="text-sm text-slate-400">
          Progress: {path.length} / {boardSize * boardSize}
        </p>
      </div>

      <SvgStage width={boardSize * cellSize} height={boardSize * cellSize}>
        {/* Checkerboard */}
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: boardSize }).map((_, col) => {
            const isLight = (row + col) % 2 === 0
            const cellNum = getCellNumber(row, col)
            const isCurrent = currentPos?.[0] === row && currentPos?.[1] === col

            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={col * cellSize}
                  y={row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={isLight ? '#475569' : '#1e293b'}
                  stroke={isCurrent ? '#3b82f6' : 'transparent'}
                  strokeWidth="4"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleCellClick(row, col)}
                />
                {cellNum > 0 && (
                  <text
                    x={col * cellSize + cellSize / 2}
                    y={row * cellSize + cellSize / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="24"
                    fontWeight="bold"
                  >
                    {cellNum}
                  </text>
                )}
              </g>
            )
          })
        )}

        {/* Path lines */}
        {path.length > 1 && (
          <g stroke="#22c55e" strokeWidth="3" fill="none">
            {path.slice(0, -1).map(([r1, c1], i) => {
              const [r2, c2] = path[i + 1]
              return (
                <line
                  key={i}
                  x1={c1 * cellSize + cellSize / 2}
                  y1={r1 * cellSize + cellSize / 2}
                  x2={c2 * cellSize + cellSize / 2}
                  y2={r2 * cellSize + cellSize / 2}
                  opacity="0.6"
                />
              )
            })}
          </g>
        )}
      </SvgStage>

      <div className="flex gap-3">
        <Button onClick={checkSolution} variant="primary">
          Check Solution
        </Button>
        <Button onClick={resetBoard} variant="secondary">
          Reset Board
        </Button>
      </div>

      {checkResult && (
        <div className="w-full max-w-2xl">
          <FeedbackPanel
            result={checkResult}
            onDismiss={() => setCheckResult(null)}
            onTryAgain={resetBoard}
            showActions={false}
          />
        </div>
      )}
    </div>
  )
}

export const knightsTourModule: ModuleDefinition = {
  metadata: {
    id: 'knights-tour',
    slug: 'knights-tour',
    title: "The Knight's Tour",
    subtitle: 'Can a chess knight visit every square exactly once?',
    difficulty: 'intermediate',
    topics: ['graph theory', 'combinatorics', 'chess'],
    estimatedTime: 20,
  },
  content: {
    readingContent: `
      <p>The Knight's Tour is a mathematical problem involving a knight on a chessboard. The challenge is to move the knight to every square on the board exactly once, following the L-shaped movement pattern of a knight in chess.</p>

      <p>This puzzle has fascinated mathematicians for centuries. The earliest known reference dates back to the 9th century, and Euler studied it extensively in 1759. On a standard 8×8 chessboard, there are approximately 26,534,728,821,064 possible knight's tours!</p>

      <p>A "closed tour" is one where the knight ends on a square that is one knight's move away from the starting square, forming a loop. An "open tour" doesn't have this restriction.</p>

      <p>The problem is an example of a Hamiltonian path problem in graph theory, where each square is a vertex and edges connect squares that are a knight's move apart.</p>
    `,
    reflectionPrompts: [
      'What strategy would help you avoid getting stuck in a corner?',
      'Is it easier to start from the center or the edge of the board?',
      'How does board size affect the difficulty of finding a tour?',
      'Can you find a closed tour that returns to the starting square?',
    ],
    hints: [
      'Try starting from a corner and work your way inward.',
      "Warnsdorf's rule: Always move to the square with the fewest onward moves.",
      'Avoid visiting squares that would isolate unvisited regions.',
    ],
  },
  InteractiveComponent: KnightsTourInteractive,
}
