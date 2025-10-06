import { useState } from 'react'
import { ModuleDefinition } from '../types'
import { SvgStage } from '@/components/visuals/SvgStage'
import { Button } from '@/components/ui/Button'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { CheckResult, isValidColoring } from '@/utils/puzzle-checker'

// Define adjacency map for regions (which regions touch which)
const ADJACENCY_MAP: Record<number, number[]> = {
  0: [1, 2, 4], // Top-left touches top-right, bottom-left, and center
  1: [0, 3, 4], // Top-right touches top-left, bottom-right, and center
  2: [0, 3, 4], // Bottom-left touches top-left, bottom-right, and center
  3: [1, 2, 4], // Bottom-right touches top-right, bottom-left, and center
  4: [0, 1, 2, 3], // Center touches all four corners
}

// Interactive Four-Color Map Component
const FourColorInteractive = () => {
  const [colors] = useState(['#ef4444', '#3b82f6', '#22c55e', '#eab308'])
  const [regionColors, setRegionColors] = useState<Record<number, number>>({})
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)

  const regions = [
    { id: 0, path: 'M 100,50 L 250,50 L 250,150 L 100,150 Z', name: 'Top Left' },
    { id: 1, path: 'M 250,50 L 400,50 L 400,150 L 250,150 Z', name: 'Top Right' },
    { id: 2, path: 'M 100,150 L 250,150 L 250,250 L 100,250 Z', name: 'Bottom Left' },
    { id: 3, path: 'M 250,150 L 400,150 L 400,250 L 250,250 Z', name: 'Bottom Right' },
    { id: 4, path: 'M 175,100 L 325,100 L 325,200 L 175,200 Z', name: 'Center' },
  ]

  const handleRegionClick = (regionId: number) => {
    const currentColor = regionColors[regionId] ?? -1
    const nextColor = (currentColor + 1) % colors.length
    setRegionColors({ ...regionColors, [regionId]: nextColor })
    setCheckResult(null) // Clear previous result when making changes
  }

  const resetColors = () => {
    setRegionColors({})
    setCheckResult(null)
  }

  const checkSolution = () => {
    const totalRegions = regions.length
    const coloredRegions = Object.keys(regionColors).length

    // Check if all regions are colored
    if (coloredRegions < totalRegions) {
      setCheckResult({
        isCorrect: false,
        isPartial: coloredRegions > 0,
        score: Math.round((coloredRegions / totalRegions) * 100),
        feedback: {
          summary: `You've colored ${coloredRegions} out of ${totalRegions} regions. Color all regions to complete the puzzle!`,
          details: [
            `${totalRegions - coloredRegions} region(s) still need to be colored.`,
            'Click on the gray regions to assign them a color.',
          ],
          nextSteps: [
            'Color all remaining regions',
            'Make sure no two adjacent regions share the same color',
          ],
        },
      })
      return
    }

    // Check if coloring is valid (no adjacent regions with same color)
    const isValid = isValidColoring(regionColors, ADJACENCY_MAP)

    if (isValid) {
      // Count unique colors used
      const uniqueColors = new Set(Object.values(regionColors)).size
      const usedFourColors = uniqueColors === 4

      setCheckResult({
        isCorrect: true,
        score: 100,
        feedback: {
          summary: usedFourColors
            ? 'Perfect! You\'ve successfully colored the map using all 4 colors with no conflicts!'
            : `Great job! You colored the map correctly using ${uniqueColors} color${uniqueColors > 1 ? 's' : ''}.`,
          details: [
            'All regions are colored',
            'No two adjacent regions share the same color',
            usedFourColors
              ? 'You used all 4 available colors - this is the maximum needed!'
              : `You used ${uniqueColors} color${uniqueColors > 1 ? 's' : ''} - the Four-Color Theorem guarantees that 4 colors are always sufficient, but fewer can sometimes work!`,
          ],
          nextSteps: usedFourColors
            ? [
                'Try to solve it using only 3 colors - is it possible?',
                'Consider why this particular configuration might need all 4 colors',
              ]
            : [
                'Excellent! You found a solution with fewer than 4 colors.',
                'Can you find a different arrangement that requires all 4 colors?',
              ],
        },
        achievements: usedFourColors ? ['Four-Color Master', 'No Conflicts'] : ['Valid Coloring'],
      })
    } else {
      // Find conflicts
      const conflicts: string[] = []
      for (const [region, color] of Object.entries(regionColors)) {
        const regionId = parseInt(region)
        const neighbors = ADJACENCY_MAP[regionId] || []

        for (const neighbor of neighbors) {
          if (regionColors[neighbor] !== undefined && regionColors[neighbor] === color) {
            const regionName = regions[regionId].name
            const neighborName = regions[neighbor].name
            conflicts.push(`${regionName} and ${neighborName} are both ${getColorName(color)}`)
          }
        }
      }

      // Remove duplicate conflicts
      const uniqueConflicts = [...new Set(conflicts)]

      setCheckResult({
        isCorrect: false,
        score: 50,
        feedback: {
          summary: 'Not quite! Some adjacent regions share the same color.',
          details: [
            `Found ${uniqueConflicts.length} conflict${uniqueConflicts.length > 1 ? 's' : ''}:`,
            ...uniqueConflicts.slice(0, 3), // Show first 3 conflicts
          ],
          hints: [
            'Adjacent regions (regions that share a border) must have different colors',
            'The center region touches all four corner regions',
            'Try changing the colors of the conflicting regions',
          ],
          nextSteps: [
            'Identify which regions are touching each other',
            'Change colors so that no two adjacent regions match',
          ],
        },
      })
    }
  }

  const getColorName = (colorIndex: number): string => {
    const names = ['Red', 'Blue', 'Green', 'Yellow']
    return names[colorIndex] || 'Unknown'
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="text-center">
        <p className="text-slate-300 mb-2">
          Click regions to color them. Can you color the entire map using only 4 colors?
        </p>
        <p className="text-sm text-slate-400">
          Colored: {Object.keys(regionColors).length} / {regions.length}
        </p>
      </div>

      <SvgStage width={500} height={300}>
        {regions.map(region => (
          <path
            key={region.id}
            d={region.path}
            fill={
              regionColors[region.id] !== undefined
                ? colors[regionColors[region.id]]
                : '#1e293b'
            }
            stroke="white"
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleRegionClick(region.id)}
          />
        ))}
      </SvgStage>

      <div className="flex gap-2">
        {colors.map((color, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-lg border-2 border-white flex items-center justify-center"
            style={{ backgroundColor: color }}
            title={getColorName(i)}
          >
            <span className="text-xs font-bold text-white drop-shadow-lg">
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={checkSolution} variant="primary">
          Check Solution
        </Button>
        <Button onClick={resetColors} variant="secondary">
          Reset Map
        </Button>
      </div>

      {checkResult && (
        <div className="w-full max-w-2xl">
          <FeedbackPanel
            result={checkResult}
            onDismiss={() => setCheckResult(null)}
            onTryAgain={resetColors}
            showActions={false}
          />
        </div>
      )}
    </div>
  )
}

export const fourColorModule: ModuleDefinition = {
  metadata: {
    id: '010',
    slug: 'four-color-theorem',
    title: 'The Four-Colour Theorem',
    subtitle: 'Can every map be colored with just four colors?',
    difficulty: 'intermediate',
    topics: ['graph theory', 'topology', 'proofs'],
    estimatedTime: 15,
  },
  content: {
    readingContent: `
      <p>The Four-Colour Theorem states that any map drawn on a plane can be colored using at most four colors in such a way that no two adjacent regions share the same color.</p>

      <p>This seemingly simple problem puzzled mathematicians for over a century. It was first proposed in 1852 by Francis Guthrie, who noticed that four colors seemed sufficient when coloring maps of the counties of England.</p>

      <p>The theorem was finally proved in 1976 by Kenneth Appel and Wolfgang Haken, making it the first major theorem to be proved using a computer. Their proof examined nearly 2,000 special configurations, a task impossible to verify by hand.</p>

      <p>Despite being proven, the Four-Colour Theorem remains fascinating because it connects topology, graph theory, and computational mathematics in unexpected ways.</p>
    `,
    reflectionPrompts: [
      {
        question: 'Why might five colors always be too many for any planar map?',
        explanation: 'The Four-Color Theorem proves that four colors are always sufficient for any planar map. Five colors would be "too many" in the sense that you never actually need the fifth color. This was proven in 1976 by Kenneth Appel and Wolfgang Haken using computer verification. The theorem shows a fundamental property of planar graphs - their chromatic number (minimum colors needed) is at most 4.',
        externalLinks: [
          {
            title: 'Four Color Theorem - Wikipedia',
            url: 'https://en.wikipedia.org/wiki/Four_color_theorem',
            description: 'Comprehensive history and mathematical details',
          },
          {
            title: 'The Four Color Theorem - Numberphile',
            url: 'https://www.youtube.com/watch?v=NgbK43jB4rQ',
            description: 'Video explanation of the theorem and its proof',
          },
        ],
      },
      {
        question: 'Can you find a configuration that requires all four colors?',
        explanation: 'Yes! The classic example is four regions arranged so that each region touches all three others, with a fifth region in the center touching all four. This configuration cannot be colored with fewer than four colors. Try it: place four regions around a central one, where the center and all four outer regions must be different colors.',
        externalLinks: [
          {
            title: 'Graph Coloring Problems',
            url: 'https://mathworld.wolfram.com/ChromaticNumber.html',
            description: 'Mathematical explanation of chromatic numbers',
          },
        ],
      },
      'What makes this theorem difficult to prove without computers?',
      {
        question: 'How does this relate to graph coloring problems in real life?',
        explanation: 'Graph coloring has many practical applications: scheduling (assign time slots avoiding conflicts), register allocation in compilers (assign CPU registers to variables), frequency assignment in cellular networks (avoid interference between nearby towers), and Sudoku puzzles (each region needs different numbers). The Four-Color Theorem provides a theoretical foundation for understanding these problems.',
        externalLinks: [
          {
            title: 'Applications of Graph Coloring',
            url: 'https://en.wikipedia.org/wiki/Graph_coloring#Applications',
            description: 'Real-world uses of graph coloring',
          },
        ],
      },
    ],
    hints: [
      'Try creating a configuration where each region touches all others.',
      'Consider what happens when you have a central region surrounded by others.',
      'Think about the maximum number of regions that can all touch each other.',
    ],
  },
  InteractiveComponent: FourColorInteractive,
}
