import { useState } from 'react'
import { ModuleDefinition } from '../types'
import { Button } from '@/components/ui/Button'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { CheckResult } from '@/utils/puzzle-checker'
import { useModuleCompletion } from '@/hooks/useModuleCompletion'
import { useProgressStore } from '@/store/progressStore'
import { motion, AnimatePresence } from 'framer-motion'

interface Animal {
  name: string
  emoji: string
  position: number
}

const animals: Animal[] = [
  { name: 'Rhinoceros', emoji: '🦏', position: 0 },
  { name: 'Grasshopper', emoji: '🦗', position: 1 },
  { name: 'Hippopotamus', emoji: '🦛', position: 2 },
  { name: 'Cat', emoji: '🐱', position: 3 },
  { name: 'Lion', emoji: '🦁', position: 4 },
  { name: 'Zebra', emoji: '🦓', position: 5 },
  { name: 'Giraffe', emoji: '🦒', position: 6 },
  { name: 'Kangaroo', emoji: '🦘', position: 7 },
  { name: 'Crocodile', emoji: '🐊', position: 8 },
  { name: 'Alligator', emoji: '🐊', position: 9 }
]

const TapAnAnimalInteractive = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [currentTap, setCurrentTap] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [hasCompletedTrick, setHasCompletedTrick] = useState(false)

  const { markComplete, trackHintUsed } = useModuleCompletion('tap-an-animal')
  const { moduleProgress } = useProgressStore()
  const progress = moduleProgress['tap-an-animal']

  // Calculate star point positions (10-pointed star)
  const getStarPosition = (index: number) => {
    const angle = (index * 36 - 90) * (Math.PI / 180) // 360/10 = 36 degrees per point, start at top
    const radius = 140
    const cx = 200
    const cy = 200
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    }
  }

  const startTapping = () => {
    if (!selectedAnimal) return

    setIsAnimating(true)
    setCurrentTap(0)
    setCheckResult(null)

    // Animate through the letters
    const letterCount = selectedAnimal.name.length
    let tap = 0

    const interval = setInterval(() => {
      tap++
      setCurrentTap(tap % 10)

      if (tap >= letterCount) {
        clearInterval(interval)
        setTimeout(() => {
          setIsAnimating(false)
          checkTrick(tap % 10, selectedAnimal)
        }, 500)
      }
    }, 400)
  }

  const checkTrick = (finalPosition: number, animal: Animal) => {
    const isCorrect = finalPosition === animal.position

    if (isCorrect) {
      if (!hasCompletedTrick) {
        markComplete()
        setHasCompletedTrick(true)
      }

      setCheckResult({
        isCorrect: true,
        score: 100,
        feedback: {
          summary: `Amazing! The trick worked perfectly! You landed on ${animal.emoji} ${animal.name}!`,
          details: [
            `${animal.name} has ${animal.name.length} letters`,
            `Starting from Rhinoceros (position 0) and tapping ${animal.name.length} times brings you to position ${finalPosition}`,
            'The trick works because each animal\'s position matches the number of letters in its name (modulo 10)',
            'This is an example of modular arithmetic - a fundamental concept in number theory!'
          ],
          nextSteps: [
            'Try another animal to see the pattern',
            'Can you figure out why positions 0, 1, and 2 have 10, 11, and 12-letter names?'
          ]
        }
      })
    } else {
      setCheckResult({
        isCorrect: false,
        feedback: {
          summary: 'Hmm, something went wrong with the trick.',
          details: [
            'Make sure you\'re starting from Rhinoceros and moving clockwise',
            'Count one tap for each letter in the animal\'s name'
          ]
        }
      })
    }
  }

  const reset = () => {
    setSelectedAnimal(null)
    setCurrentTap(0)
    setIsAnimating(false)
    setCheckResult(null)
    setShowExplanation(false)
  }

  const toggleExplanation = () => {
    if (!showExplanation) {
      trackHintUsed()
    }
    setShowExplanation(!showExplanation)
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-5xl">
      {/* Instructions */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-3 text-purple-300">🎩 The Magic Trick</h3>
        <p className="text-slate-300 mb-3">
          Choose any animal below. The trick will spell out the animal's name while tapping around the star,
          starting from Rhinoceros and moving clockwise. Miraculously, it will land on your chosen animal!
        </p>
        <p className="text-sm text-purple-200">
          This clever mathematical trick uses modular arithmetic to always work perfectly.
        </p>
      </div>

      {/* Animal Selection */}
      <div className="w-full">
        <h4 className="text-lg font-bold mb-4 text-center">Choose an Animal</h4>
        <div className="grid grid-cols-5 gap-3">
          {animals.map((animal) => (
            <button
              key={animal.position}
              onClick={() => setSelectedAnimal(animal)}
              disabled={isAnimating}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${selectedAnimal?.position === animal.position
                  ? 'bg-purple-600 border-purple-400 scale-105'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
                }
                ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="text-4xl mb-2">{animal.emoji}</div>
              <div className="text-xs font-semibold">{animal.name}</div>
              <div className="text-xs text-slate-400">{animal.name.length} letters</div>
            </button>
          ))}
        </div>
      </div>

      {/* Star Diagram */}
      <div className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
          {/* Draw connecting lines (star shape) */}
          <g className="opacity-30">
            {animals.map((_, i) => {
              const from = getStarPosition(i)
              const to = getStarPosition((i + 3) % 10) // Connect every 3rd point to make a star
              return (
                <line
                  key={`line-${i}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#7c3aed"
                  strokeWidth="2"
                />
              )
            })}
          </g>

          {/* Draw points with animals */}
          {animals.map((animal, i) => {
            const pos = getStarPosition(i)
            const isCurrentTap = currentTap === i && isAnimating
            const isStartPoint = i === 0

            return (
              <g key={animal.position}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isCurrentTap ? 30 : 20}
                  fill={isCurrentTap ? '#a855f7' : isStartPoint ? '#ec4899' : '#1e293b'}
                  stroke={isCurrentTap ? '#ffffff' : '#7c3aed'}
                  strokeWidth={isCurrentTap ? 4 : 2}
                  animate={isCurrentTap ? {
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.8, 1]
                  } : {}}
                  transition={{ duration: 0.3 }}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl select-none pointer-events-none"
                >
                  {animal.emoji}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 40}
                  textAnchor="middle"
                  className="text-xs fill-slate-300 select-none pointer-events-none font-semibold"
                >
                  {animal.name}
                </text>
              </g>
            )
          })}

          {/* Center label */}
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-purple-400 font-bold"
          >
            {isAnimating && selectedAnimal ? (
              <>Spelling: {selectedAnimal.name.substring(0, currentTap)}</>
            ) : (
              <>Tap-an-Animal</>
            )}
          </text>
        </svg>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button
          onClick={startTapping}
          variant="primary"
          disabled={!selectedAnimal || isAnimating}
        >
          {isAnimating ? 'Tapping...' : 'Start the Trick'}
        </Button>
        <Button onClick={reset} variant="secondary">
          Reset
        </Button>
        <Button onClick={toggleExplanation} variant="ghost">
          {showExplanation ? 'Hide' : 'Show'} How It Works
        </Button>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden"
          >
            <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <h4 className="text-lg font-bold text-yellow-400 mb-3">🎯 The Secret</h4>
              <div className="space-y-3 text-yellow-200/90">
                <p>
                  The trick works because of <strong>modular arithmetic</strong>! Each animal is positioned
                  at a point that equals the number of letters in its name.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Position 3:</strong> Cat (3 letters)</li>
                  <li><strong>Position 4:</strong> Lion (4 letters)</li>
                  <li><strong>Position 5:</strong> Zebra (5 letters)</li>
                  <li>...and so on up to position 9</li>
                </ul>
                <p>
                  For positions 0, 1, and 2, we use animals with 10, 11, and 12 letters. Since we're working
                  with a 10-pointed star, 10 taps brings you back to position 0 (10 mod 10 = 0), 11 taps
                  brings you to position 1, and 12 taps to position 2!
                </p>
                <p className="text-sm italic">
                  This is the same mathematical principle used in clocks (12-hour cycle) and calendars (7-day week).
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      {checkResult && (
        <div className="w-full">
          <FeedbackPanel
            result={checkResult}
            onDismiss={() => setCheckResult(null)}
            onTryAgain={reset}
            showActions={false}
            xpEarned={progress?.xpEarned}
          />
        </div>
      )}
    </div>
  )
}

export const tapAnAnimalModule: ModuleDefinition = {
  metadata: {
    id: '004',
    slug: 'tap-an-animal',
    title: 'Tap-an-Animal',
    subtitle: 'A Mathematical Magic Trick with Modular Arithmetic',
    difficulty: 'beginner',
    topics: ['modular arithmetic', 'number theory', 'magic tricks'],
    estimatedTime: 8,
  },
  content: {
    readingContent: `
      <h3>The Magic of Modular Arithmetic</h3>

      <p>The "Tap-an-Animal" trick is a delightful example of <strong>modular arithmetic</strong> disguised as magic. At first glance, it seems impossible that spelling an animal's name while tapping around a star could consistently land on the correct animal. But mathematics makes it work every time!</p>

      <h4>What is Modular Arithmetic?</h4>

      <p><strong>Modular arithmetic</strong> is sometimes called "clock arithmetic" because it works just like a clock face. When you count past 12 on a clock, you wrap back around to 1. Similarly, in modulo 10 arithmetic (which this trick uses), counting past 10 wraps back to 0.</p>

      <p>The mathematical notation is: <code>a ≡ b (mod n)</code>, read as "a is congruent to b modulo n"</p>

      <h4>How the Trick Works</h4>

      <p>The genius of this trick lies in careful planning:</p>

      <ol>
        <li>Each animal is positioned at point <em>n</em> on the star</li>
        <li>Each animal's name has exactly <em>n</em> letters (or <em>n + 10</em> letters)</li>
        <li>Starting from position 0 and taking <em>n</em> steps clockwise always lands on position <em>n</em></li>
      </ol>

      <p>For example:</p>
      <ul>
        <li><strong>Cat</strong> (3 letters) is at position 3</li>
        <li><strong>Giraffe</strong> (7 letters) is at position 7</li>
        <li><strong>Rhinoceros</strong> (10 letters) is at position 0 (because 10 mod 10 = 0)</li>
      </ul>

      <h4>Real-World Applications</h4>

      <p>Modular arithmetic isn't just for party tricks - it's fundamental to modern technology:</p>

      <ul>
        <li><strong>Cryptography</strong>: RSA encryption relies heavily on modular arithmetic with large prime numbers</li>
        <li><strong>Hash Functions</strong>: Used in databases and blockchain to distribute data evenly</li>
        <li><strong>Error Detection</strong>: ISBN book codes and credit card numbers use modular arithmetic to detect typos</li>
        <li><strong>Music Theory</strong>: The 12-tone scale wraps around using mod 12</li>
        <li><strong>Computer Science</strong>: Array indexing with wraparound uses modular arithmetic</li>
      </ul>

      <h4>The Mathematics</h4>

      <p>When we say "13 mod 10 = 3", we're asking: "What's the remainder when 13 is divided by 10?" The answer is 3, because 13 = 10 × 1 + 3.</p>

      <p>This concept is used throughout mathematics:</p>
      <ul>
        <li>In <strong>number theory</strong>, to study divisibility and prime numbers</li>
        <li>In <strong>abstract algebra</strong>, as the foundation for group theory</li>
        <li>In <strong>computer science</strong>, for algorithms and data structures</li>
      </ul>

      <h4>Try This!</h4>

      <p>Can you create your own version with different objects? Here's the key:</p>
      <ol>
        <li>Choose how many points your "star" will have (e.g., 12 for a clock)</li>
        <li>Find objects whose names have the right number of letters</li>
        <li>Position each object at the point matching its letter count (mod your star size)</li>
      </ol>

      <p>The mathematical principle guarantees it will work every single time!</p>
    `,
    reflectionPrompts: [
      {
        question: 'Why do we need animals with 10, 11, and 12 letters for positions 0, 1, and 2?',
        explanation: 'In modulo 10 arithmetic, numbers wrap around after 10. So 10 mod 10 = 0, 11 mod 10 = 1, and 12 mod 10 = 2. This is why Rhinoceros (10 letters) goes at position 0, Grasshopper (11 letters) at position 1, and Hippopotamus (12 letters) at position 2. Without this trick, we\'d have no animals at those positions!',
      },
      {
        question: 'How is this similar to telling time on a clock?',
        explanation: 'A clock is a perfect example of modular arithmetic! When it\'s 11 o\'clock and you add 3 hours, you get 2 o\'clock, not 14 o\'clock. That\'s because 11 + 3 = 14, and 14 mod 12 = 2. The clock "wraps around" just like our star does after 10 points.',
        externalLinks: [
          {
            title: 'Modular Arithmetic Explained',
            url: 'https://en.wikipedia.org/wiki/Modular_arithmetic',
            description: 'Comprehensive overview of modular arithmetic'
          }
        ]
      },
      'Can you create a version of this trick with 12 positions (like a clock)?',
      {
        question: 'Why is modular arithmetic important in cryptography?',
        explanation: 'Modern encryption like RSA relies on the fact that modular arithmetic with very large numbers is easy to compute in one direction but extremely hard to reverse. For example, it\'s easy to calculate 7^65537 mod 3233, but very hard to figure out the original exponent if you only know the result. This "one-way function" property keeps your data secure!',
        externalLinks: [
          {
            title: 'RSA Encryption',
            url: 'https://en.wikipedia.org/wiki/RSA_(cryptosystem)',
            description: 'How modular arithmetic secures the internet'
          }
        ]
      }
    ],
    hints: [
      'Look at the number of letters in each animal\'s name',
      'Notice that Cat (3 letters) is at position 3, Lion (4 letters) is at position 4...',
      'For positions 0, 1, 2: count how many letters are in Rhinoceros, Grasshopper, and Hippopotamus',
      'Think about what happens when you count past 10 on the star - you wrap back to 0!'
    ],
  },
  InteractiveComponent: TapAnAnimalInteractive,
}
