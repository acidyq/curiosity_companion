import { ReactNode } from 'react'
import { Tooltip } from './Tooltip'
import { getGlossaryEntry } from '@/utils/glossary'

interface GlossaryTermProps {
  term: string
  children?: ReactNode
  className?: string
}

export const GlossaryTerm = ({ term, children, className = '' }: GlossaryTermProps) => {
  const entry = getGlossaryEntry(term)

  if (!entry) {
    // If term not found in glossary, render as plain text
    return <span className={className}>{children || term}</span>
  }

  const tooltipContent = (
    <div className="space-y-1">
      <div className="font-semibold text-cabinet-blue">{entry.term}</div>
      <div className="text-slate-200 leading-relaxed">{entry.definition}</div>
      {entry.relatedTerms && entry.relatedTerms.length > 0 && (
        <div className="text-xs text-slate-400 pt-1 border-t border-white/10">
          Related: {entry.relatedTerms.join(', ')}
        </div>
      )}
    </div>
  )

  return (
    <Tooltip content={tooltipContent} delay={150}>
      <span
        className={`
          inline-block cursor-help
          border-b-2 border-dotted border-cabinet-blue/50
          hover:border-cabinet-blue hover:text-cabinet-blue
          transition-all duration-200
          ${className}
        `}
      >
        {children || term}
      </span>
    </Tooltip>
  )
}

/**
 * Automatically wrap glossary terms in text content
 * Usage: <span dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(text) }} />
 */
export const wrapGlossaryTerms = (html: string): string => {
  // List of terms to auto-wrap (case-insensitive)
  const termsToWrap = [
    'adjacent',
    'vertex',
    'vertices',
    'edge',
    'planar',
    'chromatic',
    'Hamiltonian path',
    'topology',
    'orientable',
    'non-orientable',
    'manifold',
    'prime',
    'factorial',
    'combinatorics',
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

    // Replace with glossary term component marker
    result = result.replace(regex, (match) => {
      return `<span class="glossary-term" data-term="${term.toLowerCase()}">${match}</span>`
    })
  }

  return result
}
