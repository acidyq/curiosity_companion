import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { wrapGlossaryTerms } from '@/components/ui/GlossaryTerm'
import { attachEnhancedTooltips } from '@/components/ui/GlossaryTooltip'
import { getGlossaryEntry } from '@/utils/glossary'

interface ReadingPaneProps {
  title: string
  content: string
}

export const ReadingPane = ({ title, content }: ReadingPaneProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Attach enhanced tooltips
    const cleanup = attachEnhancedTooltips(contentRef.current, getGlossaryEntry)

    return cleanup
  }, [content])

  // Wrap glossary terms in the HTML content
  const processedContent = wrapGlossaryTerms(content)

  return (
    <Card variant="glass" className="h-full overflow-y-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">📖 Read</h2>
        <p className="text-xs text-slate-400 mt-1">
          Click the <span className="text-cabinet-blue">❔</span> icon next to terms for definitions
        </p>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          <div
            ref={contentRef}
            className="text-slate-300 leading-relaxed whitespace-pre-wrap glossary-content"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
