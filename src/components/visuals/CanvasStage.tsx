import { useEffect, useRef, useCallback } from 'react'

interface CanvasStageProps {
  width: number
  height: number
  draw: (ctx: CanvasRenderingContext2D, time: number) => void
  animate?: boolean
  className?: string
}

export const CanvasStage = ({
  width,
  height,
  draw,
  animate = false,
  className,
}: CanvasStageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(Date.now())

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const elapsed = (Date.now() - startTimeRef.current) / 1000
    ctx.clearRect(0, 0, width, height)
    draw(ctx, elapsed)

    if (animate) {
      animationRef.current = requestAnimationFrame(render)
    }
  }, [width, height, draw, animate])

  useEffect(() => {
    render()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [render])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}
