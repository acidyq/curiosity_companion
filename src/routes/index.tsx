import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllModules } from '@/modules'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'

export const HomePage = () => {
  const modules = getAllModules()

  return (
    <div className="cabinet-container">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold font-display mb-4">
          <span className="glow-text">The Cabinet</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Explore mathematical curiosities through interactive puzzles, visual simulations,
          and hands-on demonstrations.
        </p>
      </motion.div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {modules.map((module, index) => (
          <motion.div
            key={module.metadata.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/section/${module.metadata.slug}`}>
              <Card
                variant="glass"
                className="h-full hover:scale-105 hover:shadow-2xl hover:shadow-cabinet-blue/20 transition-all cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1 group-hover:text-cabinet-blue transition-colors">
                        {module.metadata.title}
                      </h3>
                      {module.metadata.subtitle && (
                        <p className="text-sm text-slate-400">{module.metadata.subtitle}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        module.metadata.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : module.metadata.difficulty === 'intermediate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {module.metadata.difficulty}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {module.metadata.topics.map(topic => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>⏱️ {module.metadata.estimatedTime} min</span>
                    <span className="group-hover:text-cabinet-blue transition-colors">
                      Explore →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-panel p-8 rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <Progress value={0} showLabel />
        <p className="mt-4 text-sm text-slate-400">
          Complete modules to unlock new mathematical adventures
        </p>
      </motion.div>
    </div>
  )
}
