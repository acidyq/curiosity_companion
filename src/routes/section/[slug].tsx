import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getModule } from '@/modules'
import { ReadingPane } from '@/components/panels/ReadingPane'
import { InteractPane } from '@/components/panels/InteractPane'
import { ReflectPane } from '@/components/panels/ReflectPane'

export const SectionPage = () => {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <Navigate to="/" replace />
  }

  const module = getModule(slug)

  if (!module) {
    return (
      <div className="cabinet-container text-center">
        <h1 className="text-4xl font-bold mb-4">Module Not Found</h1>
        <p className="text-slate-400">The module "{slug}" doesn't exist.</p>
      </div>
    )
  }

  const { metadata, content, InteractiveComponent } = module

  return (
    <div className="cabinet-container">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold font-display mb-2">{metadata.title}</h1>
        {metadata.subtitle && (
          <p className="text-xl text-slate-400">{metadata.subtitle}</p>
        )}
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
          <span className={`px-3 py-1 rounded-full ${
            metadata.difficulty === 'beginner'
              ? 'bg-green-500/20 text-green-400'
              : metadata.difficulty === 'intermediate'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {metadata.difficulty}
          </span>
          <span>⏱️ {metadata.estimatedTime} min</span>
          <div className="flex gap-2">
            {metadata.topics.map(topic => (
              <span key={topic} className="px-2 py-1 bg-white/5 rounded">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Three-Column Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="desktop-grid"
      >
        {/* Left: Reading */}
        <div className="space-y-4">
          <ReadingPane
            title={metadata.title}
            content={content.readingContent}
          />
        </div>

        {/* Center: Interactive */}
        <div className="space-y-4">
          <InteractPane title="Explore the concept">
            <InteractiveComponent />
          </InteractPane>
        </div>

        {/* Right: Reflection */}
        <div className="space-y-4">
          <ReflectPane
            prompts={content.reflectionPrompts}
            hints={content.hints}
          />
        </div>
      </motion.div>
    </div>
  )
}
