import { useState } from 'react'
import { ModuleDefinition } from '../types'
import { CanvasStage } from '@/components/visuals/CanvasStage'
import { Slider } from '@/components/puzzles/controls/Slider'
import { Toggle } from '@/components/puzzles/controls/Toggle'

// Interactive Möbius Band Visualization
const MobiusInteractive = () => {
  const [rotation, setRotation] = useState(0)
  const [showPath, setShowPath] = useState(true)
  const [animate, setAnimate] = useState(false)

  const drawMobius = (ctx: CanvasRenderingContext2D, time: number) => {
    const centerX = 300
    const centerY = 250
    const radius = 150
    const width = 40
    const angle = animate ? time * 0.5 : rotation / 100 * Math.PI * 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle)

    // Draw the Möbius strip
    const segments = 60
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 2
      const nextT = ((i + 1) / segments) * Math.PI * 2

      // Position on the central circle
      const x1 = radius * Math.cos(t)
      const y1 = radius * Math.sin(t)
      const x2 = radius * Math.cos(nextT)
      const y2 = radius * Math.sin(nextT)

      // Normal direction (with twist)
      const twist1 = t / 2
      const twist2 = nextT / 2
      const nx1 = Math.cos(twist1) * width
      const ny1 = Math.sin(twist1) * width * Math.sin(t)
      const nx2 = Math.cos(twist2) * width
      const ny2 = Math.sin(twist2) * width * Math.sin(nextT)

      // Draw segment
      const brightness = 150 + Math.cos(t) * 100
      ctx.fillStyle = `rgb(${brightness}, ${brightness * 0.6}, ${brightness * 1.2})`
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1

      ctx.beginPath()
      ctx.moveTo(x1 + nx1, y1 + ny1)
      ctx.lineTo(x2 + nx2, y2 + ny2)
      ctx.lineTo(x2 - nx2, y2 - ny2)
      ctx.lineTo(x1 - nx1, y1 - ny1)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }

    // Draw centerline path if enabled
    if (showPath) {
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2
        const x = radius * Math.cos(t)
        const y = radius * Math.sin(t)
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    ctx.restore()
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="text-center max-w-md">
        <p className="text-slate-300">
          A Möbius band has only one side and one edge. Rotate it to see the continuous surface!
        </p>
      </div>

      <CanvasStage
        width={600}
        height={500}
        draw={drawMobius}
        animate={animate}
        className="rounded-lg bg-slate-900"
      />

      <div className="w-full max-w-md space-y-4">
        <Slider
          label="Rotation"
          min={0}
          max={100}
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          disabled={animate}
        />

        <div className="flex items-center justify-between">
          <Toggle
            label="Show centerline path"
            checked={showPath}
            onChange={(e) => setShowPath(e.target.checked)}
          />
          <Toggle
            label="Auto-rotate"
            checked={animate}
            onChange={(e) => setAnimate(e.target.checked)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm max-w-md">
        <div className="glass-panel p-3 rounded-lg">
          <div className="font-semibold text-cabinet-blue">Sides</div>
          <div className="text-2xl font-bold">1</div>
        </div>
        <div className="glass-panel p-3 rounded-lg">
          <div className="font-semibold text-cabinet-purple">Edges</div>
          <div className="text-2xl font-bold">1</div>
        </div>
      </div>
    </div>
  )
}

export const mobiusModule: ModuleDefinition = {
  metadata: {
    id: 'mobius',
    slug: 'mobius-band',
    title: 'The Möbius Band',
    subtitle: 'A surface with only one side',
    difficulty: 'beginner',
    topics: ['topology', 'geometry', 'surfaces'],
    estimatedTime: 10,
  },
  content: {
    readingContent: `
      <p>The Möbius band (or Möbius strip) is a surface with only one side and one boundary. It was discovered independently by German mathematicians August Möbius and Johann Listing in 1858.</p>

      <p>You can create a Möbius band by taking a strip of paper, giving it a half-twist, and joining the ends together. The resulting object has the remarkable property that if you start drawing a line along its center, you'll end up back where you started—but on the "other side" of the paper!</p>

      <p>What makes this truly fascinating is that the Möbius band demonstrates that our intuition about surfaces can be wrong. It challenges the notion that every surface must have two distinct sides.</p>

      <p>The Möbius band has practical applications too: conveyor belts shaped like Möbius strips wear evenly on both "sides," and it appears in electronics, chemistry, and even art and architecture.</p>
    `,
    reflectionPrompts: [
      {
        question: 'What happens if you cut a Möbius band along its centerline?',
        explanation: 'When you cut a Möbius band along its centerline, you don\'t get two separate bands as you might expect! Instead, you get a single longer band with two full twists. This surprising result demonstrates the topological properties of the Möbius band. If you cut that resulting band along its centerline again, you get two interlinked bands!',
        externalLinks: [
          {
            title: 'Cutting a Möbius Strip - YouTube Demo',
            url: 'https://www.youtube.com/watch?v=k_wjhrsYKcI',
            description: 'Visual demonstration of cutting a Möbius band',
          },
          {
            title: 'Möbius Strip - Wikipedia',
            url: 'https://en.wikipedia.org/wiki/M%C3%B6bius_strip',
            description: 'Comprehensive mathematical description',
          },
        ],
      },
      'Can you imagine a Möbius band in three dimensions without twisting paper?',
      {
        question: 'How is the Möbius band different from a regular loop of paper?',
        explanation: 'A regular loop has two distinct sides (inside and outside) and two edges. The Möbius band has only ONE side and ONE edge. If you start at any point and trace along the surface, you\'ll cover both "sides" of the original paper without crossing an edge. This property makes it a non-orientable surface in topology - there\'s no consistent "up" or "down" direction.',
        externalLinks: [
          {
            title: 'Orientability in Topology',
            url: 'https://en.wikipedia.org/wiki/Orientability',
            description: 'Understanding orientable vs. non-orientable surfaces',
          },
        ],
      },
      {
        question: 'What would happen if you gave the strip two half-twists instead of one?',
        explanation: 'Two half-twists (one full twist) creates a different object! Unlike the Möbius band, this has TWO sides and TWO edges again. It\'s called a "twisted cylinder" and is orientable. Three half-twists would create another non-orientable surface, similar to the Möbius band but with more complex properties.',
        externalLinks: [
          {
            title: 'Topology of Twisted Bands',
            url: 'https://mathworld.wolfram.com/TwistedCylinder.html',
            description: 'Mathematical properties of twisted surfaces',
          },
        ],
      },
    ],
    hints: [
      'Try making a physical Möbius band with paper to better understand its properties.',
      'Trace your finger along the surface—you\'ll visit both "sides" without crossing an edge.',
      'The boundary of a Möbius band forms a single continuous loop.',
    ],
  },
  InteractiveComponent: MobiusInteractive,
}
