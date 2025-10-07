import { useState } from 'react'
import { ModuleDefinition } from '../types'
import { Button } from '@/components/ui/Button'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { CheckResult } from '@/utils/puzzle-checker'
import { useModuleCompletion } from '@/hooks/useModuleCompletion'
import { useProgressStore } from '@/store/progressStore'
import { motion, AnimatePresence } from 'framer-motion'

interface Pattern {
  id: string
  title: string
  description: string
  calculations: { input: string; result: string }[]
  explanation: string
  mathematicalPrinciple: string
}

const patterns: Pattern[] = [
  {
    id: 'palindrome-squares',
    title: 'Pattern 1: Palindrome Squares',
    description: 'Try these multiplications. What pattern do you notice?',
    calculations: [
      { input: '1 × 1', result: '1' },
      { input: '11 × 11', result: '121' },
      { input: '111 × 111', result: '12,321' },
      { input: '1,111 × 1,111', result: '1,234,321' },
      { input: '11,111 × 11,111', result: '123,454,321' },
      { input: '111,111 × 111,111', result: '12,345,654,321' },
      { input: '1,111,111 × 1,111,111', result: '1,234,567,654,321' },
    ],
    explanation: 'Each result is a palindrome (reads the same forwards and backwards) that counts up to a peak number and then back down! The pattern continues: the numbers climb from 1 to a maximum, then descend symmetrically back to 1.',
    mathematicalPrinciple: 'This pattern works because of how place values interact when multiplying repunits (numbers made entirely of 1s). The carries propagate in a symmetric way, creating the palindromic structure.'
  },
  {
    id: 'cyclic-number',
    title: 'Pattern 2: The Cyclic Number 142,857',
    description: 'Enter 142,857 and multiply it by 2, 3, 4, 5, 6, and 7. What do you notice?',
    calculations: [
      { input: '142,857 × 1', result: '142,857' },
      { input: '142,857 × 2', result: '285,714' },
      { input: '142,857 × 3', result: '428,571' },
      { input: '142,857 × 4', result: '571,428' },
      { input: '142,857 × 5', result: '714,285' },
      { input: '142,857 × 6', result: '857,142' },
      { input: '142,857 × 7', result: '999,999' },
    ],
    explanation: 'The digits rotate! Each multiplication produces the same six digits in a different cyclic order. When multiplied by 7, you get all 9s. This number is called a "cyclic number" - it\'s the decimal expansion of 1/7.',
    mathematicalPrinciple: '142,857 is special because it\'s related to the fraction 1/7 = 0.142857142857... (repeating). When you multiply by 2-6, you\'re essentially getting 2/7, 3/7, etc., which all have the same repeating digits but starting at different positions!'
  }
]

const CuriousCalculationsInteractive = () => {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[0])
  const [currentStep, setCurrentStep] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [discoveredPatterns, setDiscoveredPatterns] = useState<Set<string>>(new Set())
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)

  const { markComplete, trackHintUsed } = useModuleCompletion('curious-calculations')
  const { moduleProgress } = useProgressStore()
  const progress = moduleProgress['curious-calculations']

  const nextCalculation = () => {
    if (currentStep < selectedPattern.calculations.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Pattern completed
      if (!discoveredPatterns.has(selectedPattern.id)) {
        const newDiscovered = new Set(discoveredPatterns)
        newDiscovered.add(selectedPattern.id)
        setDiscoveredPatterns(newDiscovered)

        if (newDiscovered.size === patterns.length) {
          markComplete()
          setCheckResult({
            isCorrect: true,
            score: 100,
            feedback: {
              summary: 'Amazing! You\'ve discovered all the curious calculation patterns!',
              details: [
                'You\'ve explored palindromic squares and cyclic numbers',
                'These patterns reveal deep mathematical structures',
                'Number patterns like these help mathematicians discover new theorems',
              ],
              nextSteps: [
                'Try to predict what 1,111,111 × 1,111,111 will be',
                'See if you can find other cyclic numbers'
              ]
            }
          })
        }
      }
      setShowExplanation(true)
    }
  }

  const previousCalculation = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setShowExplanation(false)
  }

  const switchPattern = (pattern: Pattern) => {
    setSelectedPattern(pattern)
    setCurrentStep(0)
    setShowExplanation(false)
    setCheckResult(null)
  }

  const revealExplanation = () => {
    if (!showExplanation) {
      trackHintUsed()
    }
    setShowExplanation(true)
  }

  const currentCalc = selectedPattern.calculations[currentStep]

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
      {/* Pattern Selector */}
      <div className="w-full grid grid-cols-2 gap-3">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => switchPattern(pattern)}
            className={`
              p-4 rounded-xl border-2 transition-all text-left
              ${selectedPattern.id === pattern.id
                ? 'bg-purple-600 border-purple-400'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }
              ${discoveredPatterns.has(pattern.id) ? 'ring-2 ring-green-500/50' : ''}
            `}
          >
            <div className="font-bold mb-1">
              {discoveredPatterns.has(pattern.id) && '✓ '}{pattern.title}
            </div>
            <div className="text-xs text-slate-300">{pattern.description}</div>
          </button>
        ))}
      </div>

      {/* Calculator Display */}
      <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-purple-500/30 p-8 shadow-2xl">
        <div className="mb-6">
          <div className="text-sm text-slate-400 mb-2">Calculation {currentStep + 1} of {selectedPattern.calculations.length}</div>
          <div className="bg-slate-950 rounded-lg p-6 border border-purple-500/20">
            <div className="text-right">
              <div className="text-3xl font-mono text-green-400 mb-2">
                {currentCalc.input}
              </div>
              <div className="text-4xl font-mono font-bold text-purple-300">
                = {currentCalc.result}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-4">
          {selectedPattern.calculations.map((_, idx) => (
            <div
              key={idx}
              className={`
                h-2 flex-1 rounded-full transition-all
                ${idx <= currentStep ? 'bg-purple-500' : 'bg-slate-700'}
              `}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={previousCalculation}
            variant="secondary"
            disabled={currentStep === 0}
          >
            ← Previous
          </Button>
          <Button
            onClick={nextCalculation}
            variant="primary"
          >
            {currentStep === selectedPattern.calculations.length - 1 ? 'Finish' : 'Next →'}
          </Button>
          <Button
            onClick={reset}
            variant="ghost"
          >
            Start Over
          </Button>
        </div>
      </div>

      {/* Pattern Question */}
      {currentStep >= 2 && !showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-6 rounded-xl bg-blue-900/30 border border-blue-500/30"
        >
          <p className="text-lg text-blue-200">
            🤔 Do you see a pattern? What do you think the next calculation will produce?
          </p>
          <Button onClick={revealExplanation} variant="ghost" className="mt-3">
            Reveal the Pattern
          </Button>
        </motion.div>
      )}

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
              <h4 className="text-lg font-bold text-yellow-400 mb-3">🎯 The Pattern Revealed</h4>
              <div className="space-y-3 text-yellow-200/90">
                <p className="font-semibold">{selectedPattern.explanation}</p>
                <div className="pt-3 border-t border-yellow-500/20">
                  <p className="text-sm">
                    <strong>Mathematical Principle:</strong> {selectedPattern.mathematicalPrinciple}
                  </p>
                </div>
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
            showActions={false}
            xpEarned={progress?.xpEarned}
          />
        </div>
      )}
    </div>
  )
}

export const curiousCalculationsModule: ModuleDefinition = {
  metadata: {
    id: '005',
    slug: 'curious-calculations',
    title: 'Curious Calculations',
    subtitle: 'Your calculator can do tricks',
    difficulty: 'beginner',
    topics: ['number patterns', 'cyclic numbers', 'number theory'],
    estimatedTime: 10,
  },
  content: {
    readingContent: `
      <h3>The Magic of Number Patterns</h3>

      <p>Numbers hide beautiful patterns that seem almost magical when you discover them. The patterns you've just explored aren't random - they're the result of deep mathematical structures.</p>

      <h4>Pattern 1: Palindromic Squares</h4>

      <p>When you square repunits (numbers made entirely of 1s), something remarkable happens: the results are perfect palindromes that count up and down!</p>

      <ul>
        <li>11 × 11 = 121 (counts 1-2-1)</li>
        <li>111 × 111 = 12,321 (counts 1-2-3-2-1)</li>
        <li>1,111 × 1,111 = 1,234,321 (counts 1-2-3-4-3-2-1)</li>
      </ul>

      <p>This pattern works because of how carries propagate during multiplication. Each digit position contributes to the final result in a symmetric way, creating the palindrome.</p>

      <p><strong>But there's a limit!</strong> This pattern works perfectly up to 111,111,111 × 111,111,111. After that, the carries disrupt the clean palindrome. Try it yourself!</p>

      <h4>Pattern 2: The Cyclic Number 142,857</h4>

      <p>The number 142,857 is extraordinary - it's the decimal expansion of 1/7:</p>

      <p>1 ÷ 7 = 0.142857142857142857... (repeating forever)</p>

      <p>When you multiply 142,857 by the numbers 1 through 6, the same six digits appear in a different cyclic order:</p>

      <ul>
        <li>142,857 × 2 = 285,714 (rotated)</li>
        <li>142,857 × 3 = 428,571 (rotated)</li>
        <li>142,857 × 4 = 571,428 (rotated)</li>
      </ul>

      <p>And when you multiply by 7? You get 999,999 - all nines!</p>

      <h4>Why Do Cyclic Numbers Exist?</h4>

      <p>Cyclic numbers arise from prime numbers and their relationship to decimal representation. The number 142,857 comes from the prime 7. Other primes produce different cyclic numbers:</p>

      <ul>
        <li>1/7 = 0.142857... (6 repeating digits)</li>
        <li>1/17 = 0.0588235294117647... (16 repeating digits)</li>
        <li>1/19 = 0.052631578947368421... (18 repeating digits)</li>
      </ul>

      <p>Not all primes create cyclic numbers, but when they do, the repeating block length is always one less than the prime!</p>

      <h4>Real-World Connections</h4>

      <p>Number patterns like these aren't just curiosities - they reveal fundamental properties of our number system:</p>

      <ul>
        <li><strong>Cryptography</strong>: Patterns in remainders help create secure encryption</li>
        <li><strong>Error Detection</strong>: ISBN and credit card checksums use modular arithmetic</li>
        <li><strong>Computer Science</strong>: Hash functions rely on cyclic properties</li>
        <li><strong>Pure Mathematics</strong>: These patterns led to discoveries in number theory and abstract algebra</li>
      </ul>

      <h4>Try This!</h4>

      <p>Can you predict what happens when you:</p>
      <ol>
        <li>Multiply 1,111,111 × 1,111,111?</li>
        <li>Find the cyclic number for 1/13?</li>
        <li>Square other repdigits (like 222 × 222 or 333 × 333)?</li>
      </ol>

      <p>Mathematics is full of these delightful surprises. The more you explore, the more patterns you'll discover!</p>
    `,
    reflectionPrompts: [
      {
        question: 'Why does the palindrome pattern eventually break down for very large repunits?',
        explanation: 'The pattern works perfectly up to 111,111,111², but breaks down after that because of how carries work in multiplication. When you have too many 1s, the intermediate sums create carries that propagate differently, disrupting the clean symmetric pattern. This is a great example of how mathematical patterns often have limits!',
      },
      {
        question: 'How is the cyclic number 142,857 related to the fraction 1/7?',
        explanation: '142,857 is literally the repeating decimal of 1/7! When you divide 1 by 7, you get 0.142857142857... forever. The cyclic property comes from the fact that 2/7, 3/7, 4/7, etc. all have the same digits, just starting at different positions in the cycle. This happens because of how long division works with certain prime numbers.',
        externalLinks: [
          {
            title: 'Cyclic Numbers - Wikipedia',
            url: 'https://en.wikipedia.org/wiki/Cyclic_number',
            description: 'Deep dive into cyclic numbers and their properties'
          }
        ]
      },
      'Can you find other numbers that create palindromes when squared?',
      {
        question: 'What mathematical field studies these kinds of number patterns?',
        explanation: 'Number theory is the branch of mathematics that studies patterns in integers. Within number theory, patterns like cyclic numbers fall under "modular arithmetic" and "properties of prime numbers." These seemingly playful patterns have led to major discoveries, including theorems that underpin modern cryptography!',
        externalLinks: [
          {
            title: 'Number Theory - Khan Academy',
            url: 'https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic',
            description: 'Introduction to number theory and modular arithmetic'
          }
        ]
      }
    ],
    hints: [
      'Look at how the digits in each result relate to the previous result',
      'For the palindromes: notice how the numbers count up to a peak, then back down',
      'For 142,857: write out all the results in a column and compare the digits',
      'The cyclic number has the same digits, just in a different order each time!'
    ],
  },
  InteractiveComponent: CuriousCalculationsInteractive,
}
