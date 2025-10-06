/**
 * Mathematical and Technical Terms Glossary
 * Provides definitions for hoverable terms throughout the app
 */

export interface GlossaryEntry {
  term: string
  definition: string
  category?: 'graph-theory' | 'topology' | 'number-theory' | 'geometry' | 'general'
  relatedTerms?: string[]
}

export const glossary: Record<string, GlossaryEntry> = {
  // Graph Theory
  adjacent: {
    term: 'Adjacent',
    definition: 'Two regions or vertices that share a common boundary or edge. In graph theory, adjacent nodes are directly connected.',
    category: 'graph-theory',
    relatedTerms: ['edge', 'vertex'],
  },
  vertex: {
    term: 'Vertex',
    definition: 'A point or node in a graph. In the context of maps, each region can be represented as a vertex.',
    category: 'graph-theory',
    relatedTerms: ['edge', 'graph'],
  },
  edge: {
    term: 'Edge',
    definition: 'A connection between two vertices in a graph. Represents a relationship or adjacency between nodes.',
    category: 'graph-theory',
    relatedTerms: ['vertex', 'graph'],
  },
  planar: {
    term: 'Planar',
    definition: 'A graph that can be drawn on a flat plane without any edges crossing each other.',
    category: 'graph-theory',
  },
  chromatic: {
    term: 'Chromatic Number',
    definition: 'The minimum number of colors needed to color a graph so that no two adjacent vertices share the same color.',
    category: 'graph-theory',
  },
  'hamiltonian path': {
    term: 'Hamiltonian Path',
    definition: 'A path in a graph that visits every vertex exactly once. Named after mathematician William Rowan Hamilton.',
    category: 'graph-theory',
    relatedTerms: ['path', 'vertex'],
  },

  // Topology
  topology: {
    term: 'Topology',
    definition: 'The mathematical study of properties that are preserved under continuous deformations like stretching and bending, but not tearing.',
    category: 'topology',
  },
  orientable: {
    term: 'Orientable',
    definition: 'A surface with a consistent notion of "clockwise" throughout. A Möbius band is non-orientable because following a path returns you facing the opposite direction.',
    category: 'topology',
  },
  'non-orientable': {
    term: 'Non-orientable',
    definition: 'A surface where there is no consistent "up" or "down" direction. Walking along the surface can flip your orientation.',
    category: 'topology',
    relatedTerms: ['orientable', 'möbius band'],
  },
  manifold: {
    term: 'Manifold',
    definition: 'A topological space that locally resembles Euclidean space. Examples include spheres, tori, and the Möbius band.',
    category: 'topology',
  },

  // Number Theory
  prime: {
    term: 'Prime Number',
    definition: 'A natural number greater than 1 that has no positive divisors other than 1 and itself.',
    category: 'number-theory',
  },
  factorial: {
    term: 'Factorial',
    definition: 'The product of all positive integers up to a given number. Written as n! (e.g., 5! = 5 × 4 × 3 × 2 × 1 = 120).',
    category: 'number-theory',
  },
  combinatorics: {
    term: 'Combinatorics',
    definition: 'The branch of mathematics concerned with counting, arrangement, and combination of objects.',
    category: 'number-theory',
  },

  // Geometry
  euclidean: {
    term: 'Euclidean',
    definition: 'Relating to the geometry of flat space as described by Euclid, where parallel lines never meet and angles in a triangle sum to 180°.',
    category: 'geometry',
  },
  theorem: {
    term: 'Theorem',
    definition: 'A mathematical statement that has been proven to be true based on previously established statements and axioms.',
    category: 'general',
  },
  conjecture: {
    term: 'Conjecture',
    definition: 'A mathematical statement believed to be true but not yet proven. The Four-Color Theorem was a conjecture for over 100 years.',
    category: 'general',
  },
  algorithm: {
    term: 'Algorithm',
    definition: 'A step-by-step procedure or set of rules for solving a problem or accomplishing a task.',
    category: 'general',
  },
  heuristic: {
    term: 'Heuristic',
    definition: 'A problem-solving approach that uses practical methods to find good-enough solutions quickly, though not guaranteed to be optimal.',
    category: 'general',
  },
  isomorphic: {
    term: 'Isomorphic',
    definition: 'Two mathematical structures that are essentially the same, differing only in the names of their elements.',
    category: 'general',
  },
}

/**
 * Get glossary entry for a term (case-insensitive)
 */
export const getGlossaryEntry = (term: string): GlossaryEntry | undefined => {
  const normalizedTerm = term.toLowerCase().trim()
  return glossary[normalizedTerm]
}

/**
 * Check if a term exists in the glossary
 */
export const hasGlossaryEntry = (term: string): boolean => {
  return getGlossaryEntry(term) !== undefined
}

/**
 * Get all terms in a category
 */
export const getTermsByCategory = (
  category: GlossaryEntry['category']
): GlossaryEntry[] => {
  return Object.values(glossary).filter(entry => entry.category === category)
}

/**
 * Search glossary by keyword
 */
export const searchGlossary = (query: string): GlossaryEntry[] => {
  const lowerQuery = query.toLowerCase()
  return Object.values(glossary).filter(
    entry =>
      entry.term.toLowerCase().includes(lowerQuery) ||
      entry.definition.toLowerCase().includes(lowerQuery)
  )
}
