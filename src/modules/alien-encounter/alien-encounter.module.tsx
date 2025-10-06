import { useState } from 'react'
import { ModuleDefinition } from '../types'
import { Button } from '@/components/ui/Button'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { CheckResult } from '@/utils/puzzle-checker'
import { useModuleCompletion } from '@/hooks/useModuleCompletion'
import { useProgressStore } from '@/store/progressStore'
import { motion } from 'framer-motion'

type Species = 'veracitor' | 'gibberish' | null

interface Alien {
  id: string
  name: string
  species: Species
}

const AlienEncounterInteractive = () => {
  const [aliens, setAliens] = useState<Alien[]>([
    { id: 'alfy', name: 'Alfy', species: null },
    { id: 'betty', name: 'Betty', species: null },
    { id: 'gemma', name: 'Gemma', species: null }
  ])
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [showHints, setShowHints] = useState(false)

  const { markComplete, trackHintUsed } = useModuleCompletion('alien-encounter')
  const { moduleProgress } = useProgressStore()
  const progress = moduleProgress['alien-encounter']

  const conversation = [
    { speaker: 'Quirk', text: 'Alfy: to which species does Betty belong?', className: 'text-blue-300' },
    { speaker: 'Alfy', text: 'Gibberish.', className: 'text-purple-300' },
    { speaker: 'Quirk', text: 'Betty: do Alfy and Gemma belong to different species?', className: 'text-blue-300' },
    { speaker: 'Betty', text: 'No.', className: 'text-green-300' },
    { speaker: 'Quirk', text: 'Gemma: to which species does Betty belong?', className: 'text-blue-300' },
    { speaker: 'Gemma', text: 'Veracitor.', className: 'text-orange-300' }
  ]

  const setSpecies = (alienId: string, species: Species) => {
    setAliens(aliens.map(alien =>
      alien.id === alienId ? { ...alien, species } : alien
    ))
    setCheckResult(null)
  }

  const reset = () => {
    setAliens(aliens.map(alien => ({ ...alien, species: null })))
    setCheckResult(null)
    setShowHints(false)
  }

  const toggleHints = () => {
    if (!showHints) {
      trackHintUsed()
    }
    setShowHints(!showHints)
  }

  const checkSolution = () => {
    const allAssigned = aliens.every(alien => alien.species !== null)

    if (!allAssigned) {
      setCheckResult({
        isCorrect: false,
        isPartial: aliens.some(alien => alien.species !== null),
        feedback: {
          summary: 'You need to assign a species to all three aliens.',
          details: [
            `You've assigned ${aliens.filter(a => a.species).length} out of 3 aliens.`,
            'Each alien must be either a Veracitor (truth-teller) or Gibberish (liar).'
          ],
          nextSteps: [
            'Assign species to the remaining aliens',
            'Use logical deduction based on their statements'
          ]
        }
      })
      return
    }

    // Correct solution: Alfy = Gibberish, Betty = Veracitor, Gemma = Veracitor
    const alfy = aliens.find(a => a.id === 'alfy')!
    const betty = aliens.find(a => a.id === 'betty')!
    const gemma = aliens.find(a => a.id === 'gemma')!

    const isCorrect =
      alfy.species === 'gibberish' &&
      betty.species === 'veracitor' &&
      gemma.species === 'veracitor'

    if (isCorrect) {
      markComplete()

      setCheckResult({
        isCorrect: true,
        score: 100,
        feedback: {
          summary: 'Perfect! You\'ve correctly identified all three aliens using pure logic!',
          details: [
            '🎯 Alfy is Gibberish (liar) - lied about Betty',
            '✅ Betty is Veracitor (truth-teller) - told truth about Alfy and Gemma being same species',
            '✅ Gemma is Veracitor (truth-teller) - told truth about Betty',
            'Since Betty said Alfy and Gemma are the same species, and Gemma is a Veracitor, Alfy must be Gibberish!'
          ],
          nextSteps: [
            'Try solving it again without hints to test your understanding',
            'Can you explain why each deduction follows logically?'
          ]
        }
      })
    } else {
      // Provide specific feedback
      const feedback: string[] = []

      // Check Alfy
      if (alfy.species === 'veracitor') {
        feedback.push('❌ If Alfy were a Veracitor, Betty would be Gibberish. But then Gemma (who says Betty is Veracitor) would be lying, making Gemma Gibberish too. But Betty says Alfy and Gemma are different species - contradiction!')
      }

      // Check Betty
      if (betty.species === 'gibberish') {
        feedback.push('❌ If Betty were Gibberish, then Alfy and Gemma would be DIFFERENT species (opposite of what Betty said). But both Alfy and Gemma agree about what Betty is - so they can\'t be different species!')
      }

      // Check Gemma
      if (gemma.species === 'gibberish') {
        feedback.push('❌ If Gemma were Gibberish, Betty would be Gibberish too. But Betty says Alfy and Gemma are the same - which would be true! Gibberish can\'t tell the truth.')
      }

      setCheckResult({
        isCorrect: false,
        score: 50,
        feedback: {
          summary: 'Not quite right. Let\'s work through the logic together.',
          details: feedback.length > 0 ? feedback : [
            'Think about what each statement tells you',
            'If someone lies, the opposite of what they say is true',
            'If someone tells the truth, their statement is accurate'
          ],
          hints: [
            'Start with Gemma: She says Betty is a Veracitor. Is that true or false?',
            'If Gemma is telling the truth, what does that make Betty?',
            'Betty says Alfy and Gemma are the SAME species. What does that tell you?',
            'If both Betty and Gemma are Veracitors, what must Alfy be?'
          ],
          nextSteps: [
            'Try assigning different species and check for logical consistency',
            'Work backwards from what you know for certain'
          ]
        }
      })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
      {/* Story */}
      <div className="w-full p-6 rounded-xl bg-slate-800/50 border border-slate-700">
        <h3 className="text-xl font-bold mb-3 text-cabinet-purple">📡 The Situation</h3>
        <p className="text-slate-300 mb-3">
          Captain Quirk and Mr. Crock have encountered three aliens on planet Noncomposmentis.
          There are two species: <span className="text-green-400 font-bold">Veracitors</span> (who always tell the truth)
          and <span className="text-red-400 font-bold">Gibberish</span> (who always lie).
        </p>
        <p className="text-slate-300">
          The aliens are physically identical. Can you determine which species each belongs to based on their answers?
        </p>
      </div>

      {/* Conversation */}
      <div className="w-full p-6 rounded-xl bg-slate-900/50 border border-slate-600">
        <h3 className="text-lg font-bold mb-4 text-cabinet-blue">💬 The Conversation</h3>
        <div className="space-y-3">
          {conversation.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3"
            >
              <span className={`font-bold min-w-[80px] ${line.className}`}>
                {line.speaker}:
              </span>
              <span className="text-slate-200">{line.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alien Selection */}
      <div className="w-full grid grid-cols-3 gap-4">
        {aliens.map((alien) => (
          <div key={alien.id} className="p-6 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-slate-600 transition-colors">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">👽</div>
              <div className="text-xl font-bold text-white">{alien.name}</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSpecies(alien.id, 'veracitor')}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                  alien.species === 'veracitor'
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                ✓ Veracitor
                <div className="text-xs opacity-75">(Truth-teller)</div>
              </button>

              <button
                onClick={() => setSpecies(alien.id, 'gibberish')}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                  alien.species === 'gibberish'
                    ? 'bg-red-600 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                ✗ Gibberish
                <div className="text-xs opacity-75">(Liar)</div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button onClick={checkSolution} variant="primary">
          Check Solution
        </Button>
        <Button onClick={reset} variant="secondary">
          Reset
        </Button>
        <Button onClick={toggleHints} variant="ghost">
          {showHints ? 'Hide' : 'Show'} Hints
        </Button>
      </div>

      {/* Hints */}
      {showHints && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
        >
          <h4 className="text-lg font-bold text-yellow-400 mb-3">💡 Logic Hints</h4>
          <ol className="space-y-2 list-decimal list-inside text-yellow-200/90">
            <li>Start by assuming each alien is a Veracitor, then check if their statements make sense</li>
            <li>If Gemma is a Veracitor, then Betty must be a Veracitor (Gemma says so)</li>
            <li>If Betty is a Veracitor, then Alfy and Gemma ARE the same species (Betty says so)</li>
            <li>If both Betty and Gemma are Veracitors, what must Alfy be?</li>
          </ol>
        </motion.div>
      )}

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

export const alienEncounterModule: ModuleDefinition = {
  metadata: {
    id: '003',
    slug: 'alien-encounter',
    title: 'Alien Encounter',
    subtitle: 'Truth-tellers and Liars on Planet Noncomposmentis',
    difficulty: 'beginner',
    topics: ['logic', 'deduction', 'puzzles'],
    estimatedTime: 10,
  },
  content: {
    readingContent: `
      <h3>Knights and Knaves: The Classic Logic Puzzle</h3>

      <p>The "Alien Encounter" is a variation of the famous <strong>Knights and Knaves</strong> puzzles, first popularized by logician Raymond Smullyan. In these puzzles, you encounter inhabitants of an island where:</p>

      <ul>
        <li><strong>Knights</strong> always tell the truth</li>
        <li><strong>Knaves</strong> always lie</li>
      </ul>

      <p>The challenge is to determine who is who based solely on their statements. These puzzles teach fundamental principles of logical deduction:</p>

      <h4>Key Logical Principles</h4>

      <ol>
        <li><strong>Self-reference paradoxes</strong>: A Knave can never say "I am a Knave" (that would be true!)</li>
        <li><strong>Contradiction elimination</strong>: If an assumption leads to a contradiction, it must be false</li>
        <li><strong>Transitive reasoning</strong>: If A implies B, and B implies C, then A implies C</li>
      </ol>

      <h4>The Method</h4>

      <p>To solve these puzzles systematically:</p>

      <ol>
        <li><strong>Assume</strong> one person is a Knight (truth-teller)</li>
        <li><strong>Derive</strong> what their statements imply about others</li>
        <li><strong>Check</strong> for contradictions</li>
        <li><strong>Adjust</strong> your assumptions if needed</li>
      </ol>

      <p>These puzzles aren't just recreational - they're the foundation of <strong>formal logic</strong>, which is used in computer science, mathematics, philosophy, and even legal reasoning!</p>

      <h4>Real-World Applications</h4>

      <p>The same logical principles apply to:</p>

      <ul>
        <li><strong>Computer programming</strong>: Boolean logic and conditionals</li>
        <li><strong>Circuit design</strong>: Logic gates (AND, OR, NOT)</li>
        <li><strong>Cryptography</strong>: Identifying valid vs. invalid information</li>
        <li><strong>Detective work</strong>: Eliminating suspects through testimony</li>
      </ul>
    `,
    reflectionPrompts: [
      {
        question: 'Could there be a solution if all three were the same species?',
        explanation: 'No! If all three were Veracitors (truth-tellers), then Alfy would be telling the truth that Betty is Gibberish - contradiction. If all were Gibberish (liars), their statements would need to all be false, but some would end up being true - another contradiction. Mixed species is the only possibility.',
      },
      {
        question: 'What if Betty had said "Yes" instead of "No"?',
        explanation: 'If Betty said "Yes" (Alfy and Gemma are different species), the solution would change! Try working it out: Betty would be lying (making her Gibberish), which means Alfy and Gemma ARE the same species. Since Gemma says Betty is Veracitor (a lie), Gemma is Gibberish. Therefore Alfy would also be Gibberish. The answer would be: All three are Gibberish!',
      },
      'How would you design a similar puzzle with 4 aliens?',
      {
        question: 'Why can\'t a Knave ever say "I am lying"?',
        explanation: 'This creates a logical paradox! If a Knave (liar) says "I am lying," they would be telling the truth about lying - which contradicts being a Knave. If they\'re telling the truth, they\'re not lying - another contradiction. This is similar to the famous "Liar\'s Paradox" which has puzzled philosophers for centuries.',
        externalLinks: [
          {
            title: 'Knights and Knaves Puzzles',
            url: 'https://en.wikipedia.org/wiki/Knights_and_Knaves',
            description: 'Learn more about Raymond Smullyan\'s classic puzzles'
          },
          {
            title: 'The Liar Paradox',
            url: 'https://en.wikipedia.org/wiki/Liar_paradox',
            description: 'Explore the philosophical implications'
          }
        ]
      }
    ],
    hints: [
      'Start by assuming Gemma is telling the truth. What does that tell you about Betty?',
      'If Betty is a Veracitor, her statement about Alfy and Gemma must be true.',
      'Work through each possibility systematically and look for contradictions.'
    ],
  },
  InteractiveComponent: AlienEncounterInteractive,
}
