// React types not needed here; keep module-agnostic

export interface ModuleMetadata {
  id: string
  slug: string
  title: string
  subtitle?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topics: string[]
  estimatedTime: number // in minutes
  thumbnail?: string
}

export interface ExternalLink {
  title: string
  url: string
  description?: string
}

export interface ReflectionPrompt {
  question: string
  explanation: string
  externalLinks?: ExternalLink[]
}

export interface ModuleContent {
  readingContent: string // markdown content
  reflectionPrompts: (string | ReflectionPrompt)[] // Support both simple strings and detailed prompts
  hints?: string[]
  solutions?: string[]
}

export interface ModuleDefinition {
  metadata: ModuleMetadata
  content: ModuleContent
  InteractiveComponent: React.FC
}

export interface PuzzleState {
  isComplete: boolean
  attempts: number
  hints: string[]
  startTime: number
}
