import { ReactNode, useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'
import { getGlossaryEntry } from '@/utils/glossary'
import { GlossaryTooltip } from './GlossaryTooltip'
import { createRoot } from 'react-dom/client'

interface GlossaryTermProps {
  term: string
  children?: ReactNode
  className?: string
}

export const GlossaryTerm = ({ term, children, className = '' }: GlossaryTermProps) => {
  const entry = getGlossaryEntry(term)
  const iconRef = useRef<HTMLSpanElement>(null)
  const [tooltipRoot, setTooltipRoot] = useState<any>(null)

  useEffect(() => {
    if (entry && iconRef.current && !tooltipRoot) {
      const container = document.createElement('div')
      container.className = 'glossary-tooltip-portal'
      document.body.appendChild(container)

      const root = createRoot(container)
      root.render(
        <GlossaryTooltip
          entry={entry}
          targetElement={iconRef.current}
          onRelatedTermClick={(relatedTerm) => {
            // Navigate to related term - you could scroll to it or open its tooltip
            const relatedElements = document.querySelectorAll(`[data-term="${relatedTerm.toLowerCase()}"]`)
            if (relatedElements.length > 0) {
              relatedElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          }}
        />
      )

      setTooltipRoot({ root, container })
    }

    return () => {
      if (tooltipRoot) {
        tooltipRoot.root.unmount()
        tooltipRoot.container.remove()
      }
    }
  }, [entry])

  if (!entry) {
    // If term not found in glossary, render as plain text
    return <span className={className}>{children || term}</span>
  }

  return (
    <span className={`inline-flex items-baseline gap-0.5 ${className}`}>
      <span>{children || term}</span>
      <span
        ref={iconRef}
        data-term={term.toLowerCase()}
        className="inline-flex items-center cursor-pointer group align-baseline"
        aria-label={`Learn more about ${term}`}
      >
        <HelpCircle className="w-3 h-3 text-cabinet-blue/60 hover:text-cabinet-blue transition-colors" />
      </span>
    </span>
  )
}

/**
 * Automatically wrap glossary terms in text content
 * Usage: <span dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(text) }} />
 */
export const wrapGlossaryTerms = (html: string): string => {
  // List of terms to auto-wrap (case-insensitive)
  const termsToWrap = [
    // Graph Theory
    'adjacent',
    'vertex',
    'vertices',
    'edge',
    'planar',
    'chromatic',
    'Hamiltonian path',
    // Topology
    'topology',
    'orientable',
    'non-orientable',
    'manifold',
    // Number Theory
    'modular arithmetic',
    'number theory',
    'divisibility',
    'abstract algebra',
    'hash functions',
    'prime',
    'factorial',
    'combinatorics',
    'palindrome',
    'cyclic number',
    'repunit',
    'number pattern',
    // Logic & CS
    'logical deduction',
    'Boolean logic',
    'conditionals',
    'logic gates',
    'cryptography',
    'formal logic',
    // Geometry & General
    'Euclidean',
    'theorem',
    'conjecture',
    'algorithm',
    'heuristic',
    'isomorphic',
  ]

  let result = html

  // Sort by length (longest first) to avoid partial matches
  const sortedTerms = [...termsToWrap].sort((a, b) => b.length - a.length)

  for (const term of sortedTerms) {
    // Create a regex that matches the term as a whole word
    const regex = new RegExp(`\\b(${term})\\b`, 'gi')

    // Replace with glossary term component marker with question mark icon
    result = result.replace(regex, (match) => {
      return `${match}<span class="glossary-term inline-block cursor-pointer" data-term="${term.toLowerCase()}" aria-label="Learn more about ${match}" style="vertical-align: baseline; margin-left: 2px;"><svg style="display: inline-block; vertical-align: baseline;" class="w-3 h-3 text-cabinet-blue/60 hover:text-cabinet-blue transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg></span>`
    })
  }

  return result
}
