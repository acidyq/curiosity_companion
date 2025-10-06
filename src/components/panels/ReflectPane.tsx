import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ReflectionPrompt } from '@/modules/types'
import { wrapGlossaryTerms } from '@/components/ui/GlossaryTerm'
import { attachEnhancedTooltips } from '@/components/ui/GlossaryTooltip'
import { getGlossaryEntry } from '@/utils/glossary'

interface ReflectPaneProps {
  prompts: (string | ReflectionPrompt)[]
  hints?: string[]
}

export const ReflectPane = ({ prompts, hints = [] }: ReflectPaneProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const isDetailedPrompt = (prompt: string | ReflectionPrompt): prompt is ReflectionPrompt => {
    return typeof prompt === 'object' && 'question' in prompt
  }

  // Attach glossary tooltips after render
  useEffect(() => {
    // Small delay to ensure dangerouslySetInnerHTML has rendered
    const timer = setTimeout(() => {
      if (!contentRef.current) return

      // Attach enhanced tooltips
      const cleanup = attachEnhancedTooltips(contentRef.current, getGlossaryEntry)

      // Store cleanup for later
      return cleanup
    }, 100) // Small delay to ensure DOM is ready

    return () => clearTimeout(timer)
  }, [prompts, hints])

  return (
    <Card variant="glass" className="h-full overflow-y-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">💭 Reflect</h2>
      </CardHeader>
      <CardContent className="space-y-6" ref={contentRef}>
        {/* Reflection Prompts */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-cabinet-blue">Think About</h3>
          <ul className="space-y-4">
            {prompts.map((prompt, i) => {
              if (isDetailedPrompt(prompt)) {
                return (
                  <li key={i} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <span className="text-cabinet-purple font-bold mt-1">{i + 1}.</span>
                      <span
                        className="text-slate-300 leading-relaxed flex-1"
                        dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(prompt.question) }}
                      />
                    </div>

                    <details className="ml-6 group">
                      <summary className="cursor-pointer text-sm text-cabinet-blue hover:text-blue-400 transition-colors font-medium">
                        → Show explanation
                      </summary>
                      <div className="mt-3 ml-4 p-4 bg-slate-800/50 rounded-lg border border-white/5 space-y-3">
                        <p
                          className="text-sm text-slate-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(prompt.explanation) }}
                        />

                        {prompt.externalLinks && prompt.externalLinks.length > 0 && (
                          <div className="pt-3 border-t border-white/10">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                              Further Reading
                            </h4>
                            <ul className="space-y-2">
                              {prompt.externalLinks.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/link inline-flex items-start space-x-2 text-sm hover:text-cabinet-blue transition-colors"
                                  >
                                    <span className="text-cabinet-purple group-hover/link:text-cabinet-blue">🔗</span>
                                    <div className="flex-1">
                                      <div className="font-medium text-blue-400 group-hover/link:underline">
                                        {link.title}
                                      </div>
                                      {link.description && (
                                        <div
                                          className="text-xs text-slate-400 mt-0.5"
                                          dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(link.description) }}
                                        />
                                      )}
                                    </div>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </details>
                  </li>
                )
              } else {
                return (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="text-cabinet-purple font-bold mt-1">{i + 1}.</span>
                    <span
                      className="text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(prompt) }}
                    />
                  </li>
                )
              }
            })}
          </ul>
        </div>

        {/* Hints */}
        {hints.length > 0 && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold mb-3 text-cabinet-yellow">Hints</h3>
            <div className="space-y-2">
              {hints.map((hint, i) => (
                <details key={i} className="group">
                  <summary className="cursor-pointer text-sm text-slate-400 hover:text-white transition-colors">
                    💡 Hint {i + 1}
                  </summary>
                  <p
                    className="mt-2 ml-6 text-sm text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: wrapGlossaryTerms(hint) }}
                  />
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-white/10 pt-6 space-y-3">
          <Button variant="ghost" className="w-full">
            ✓ Mark Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
