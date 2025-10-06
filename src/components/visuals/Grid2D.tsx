import { SvgStage } from './SvgStage'

interface Grid2DProps {
  width: number
  height: number
  cellSize: number
  showAxes?: boolean
  showGrid?: boolean
  children?: React.ReactNode
}

export const Grid2D = ({
  width,
  height,
  cellSize,
  showAxes = true,
  showGrid = true,
  children,
}: Grid2DProps) => {
  const cols = Math.ceil(width / cellSize)
  const rows = Math.ceil(height / cellSize)

  return (
    <SvgStage width={width} height={height}>
      {/* Grid lines */}
      {showGrid && (
        <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={height}
            />
          ))}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * cellSize}
              x2={width}
              y2={i * cellSize}
            />
          ))}
        </g>
      )}

      {/* Axes */}
      {showAxes && (
        <g stroke="rgba(255,255,255,0.3)" strokeWidth="2">
          <line x1={width / 2} y1={0} x2={width / 2} y2={height} />
          <line x1={0} y1={height / 2} x2={width} y2={height / 2} />
        </g>
      )}

      {children}
    </SvgStage>
  )
}
