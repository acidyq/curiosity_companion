import { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

interface InteractPaneProps {
  title: string
  children: ReactNode
}

export const InteractPane = ({ title, children }: InteractPaneProps) => {
  return (
    <Card variant="elevated" className="h-full">
      <CardHeader>
        <h2 className="text-2xl font-bold">🎮 Interact</h2>
        <p className="text-slate-400 text-sm mt-1">{title}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {children}
      </CardContent>
    </Card>
  )
}
