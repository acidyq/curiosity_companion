import { SvgStage } from './SvgStage'

interface NumberLineProps {
  min: number
  max: number
  width?: number
  height?: number
  markers?: number[]
  highlightValues?: number[]
}

export const NumberLine = ({
  min,
  max,
  width = 600,
  height = 100,
  markers = [],
  highlightValues = [],
}: NumberLineProps) => {
  const padding = 40
  const lineY = height / 2
  const scale = (width - 2 * padding) / (max - min)

  const xPos = (value: number) => padding + (value - min) * scale

  return (
    <SvgStage width={width} height={height}>
      {/* Main line */}
      <line
        x1={padding}
        y1={lineY}
        x2={width - padding}
        y2={lineY}
        stroke="white"
        strokeWidth="2"
      />

      {/* End arrows */}
      <polygon
        points={`${width - padding},${lineY} ${width - padding - 8},${lineY - 4} ${width - padding - 8},${lineY + 4}`}
        fill="white"
      />

      {/* Markers */}
      {markers.map((value, i) => (
        <g key={i}>
          <line
            x1={xPos(value)}
            y1={lineY - 8}
            x2={xPos(value)}
            y2={lineY + 8}
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={xPos(value)}
            y={lineY + 25}
            textAnchor="middle"
            fill="white"
            fontSize="12"
          >
            {value}
          </text>
        </g>
      ))}

      {/* Highlighted values */}
      {highlightValues.map((value, i) => (
        <circle
          key={i}
          cx={xPos(value)}
          cy={lineY}
          r="6"
          fill="#2563eb"
          stroke="white"
          strokeWidth="2"
        />
      ))}
    </SvgStage>
  )
}
