import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface AppShellProps {
  children: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10"
      >
        <div className="cabinet-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cabinet-blue to-cabinet-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧮</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-display">Curiosity Companion</h1>
                <p className="text-xs text-slate-400">Professor Stewart's Mathematical Cabinet</p>
              </div>
            </Link>

            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                All Modules
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="pt-24 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="cabinet-container text-center text-sm text-slate-400">
          <p>Interactive companion to Professor Stewart's Cabinet of Mathematical Curiosities</p>
          <p className="mt-2">Built with React, TypeScript, and Framer Motion</p>
        </div>
      </footer>
    </div>
  )
}
