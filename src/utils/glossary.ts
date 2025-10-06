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
  'modular arithmetic': {
    term: 'Modular Arithmetic',
    definition: 'A system of arithmetic for integers where numbers "wrap around" after reaching a certain value (the modulus). Like a clock where 12 + 2 = 2. Used extensively in cryptography and computer science.',
    category: 'number-theory',
    relatedTerms: ['number theory', 'cryptography'],
  },
  'number theory': {
    term: 'Number Theory',
    definition: 'The branch of mathematics devoted to the study of integers and their properties, including prime numbers, divisibility, and modular arithmetic.',
    category: 'number-theory',
    relatedTerms: ['prime', 'modular arithmetic'],
  },
  divisibility: {
    term: 'Divisibility',
    definition: 'The property of one integer being divisible by another without leaving a remainder. For example, 12 is divisible by 3 because 12 ÷ 3 = 4 with no remainder.',
    category: 'number-theory',
    relatedTerms: ['prime', 'modular arithmetic'],
  },
  'abstract algebra': {
    term: 'Abstract Algebra',
    definition: 'The study of algebraic structures such as groups, rings, and fields. Modular arithmetic forms the basis for understanding these structures.',
    category: 'number-theory',
    relatedTerms: ['modular arithmetic', 'number theory'],
  },
  'hash functions': {
    term: 'Hash Functions',
    definition: 'Functions that map data of arbitrary size to fixed-size values. Uses modular arithmetic to distribute data evenly. Essential for databases, cryptography, and blockchain.',
    category: 'general',
    relatedTerms: ['modular arithmetic', 'cryptography'],
  },

  // Geometry
  euclidean: {
    term: 'Euclidean',
    definition: 'Relating to the geometry of flat space as described by Euclid, where parallel lines never meet and angles in a triangle sum to 180°.',
    category: 'geometry',
  },

  // Logic & Computer Science
  'logical deduction': {
    term: 'Logical Deduction',
    definition: 'The process of reasoning from one or more statements (premises) to reach a logically certain conclusion. In Knights and Knaves puzzles, you deduce who is truthful based on their statements.',
    category: 'general',
    relatedTerms: ['boolean logic', 'conditionals'],
  },
  'boolean logic': {
    term: 'Boolean Logic',
    definition: 'A branch of algebra where variables have only two possible values: true or false. Named after mathematician George Boole, it\'s the foundation of digital circuits and programming.',
    category: 'general',
    relatedTerms: ['logic gates', 'conditionals'],
  },
  conditionals: {
    term: 'Conditionals',
    definition: 'Logical statements of the form "if P then Q" where the conclusion Q follows when the premise P is true. Used in programming (if/else statements) and logical reasoning.',
    category: 'general',
    relatedTerms: ['boolean logic', 'logical deduction'],
  },
  'logic gates': {
    term: 'Logic Gates',
    definition: 'Electronic circuits that perform basic logical operations (AND, OR, NOT, etc.). They are the building blocks of all digital devices, from computers to smartphones.',
    category: 'general',
    relatedTerms: ['boolean logic', 'algorithm'],
  },
  cryptography: {
    term: 'Cryptography',
    definition: 'The science of securing information by transforming it into an unreadable format. Modern cryptography relies heavily on mathematical logic, prime numbers, and computational complexity.',
    category: 'general',
    relatedTerms: ['algorithm', 'prime'],
  },
  'formal logic': {
    term: 'Formal Logic',
    definition: 'The study of inference and reasoning using a formal symbolic system. Knights and Knaves puzzles are exercises in formal logic, teaching systematic reasoning.',
    category: 'general',
    relatedTerms: ['logical deduction', 'boolean logic'],
  },

  // General
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
