import { SvgStage } from './SvgStage'
import { Point } from '@/utils/math/geometry'

interface GraphPlotProps {
  width?: number
  height?: number
  nodes: Array<{ id: number; position: Point }>
  edges: Array<[number, number]>
  nodeColors?: Record<number, string>
}

export const GraphPlot = ({
  width = 600,
  height = 600,
  nodes,
  edges,
  nodeColors = {},
}: GraphPlotProps) => {
  const nodeRadius = 20

  return (
    <SvgStage width={width} height={height}>
      {/* Edges */}
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="2">
        {edges.map(([from, to], i) => {
          const fromNode = nodes.find(n => n.id === from)
          const toNode = nodes.find(n => n.id === to)
          if (!fromNode || !toNode) return null

          return (
            <line
              key={i}
              x1={fromNode.position.x}
              y1={fromNode.position.y}
              x2={toNode.position.x}
              y2={toNode.position.y}
            />
          )
        })}
      </g>

      {/* Nodes */}
      {nodes.map(node => (
        <g key={node.id}>
          <circle
            cx={node.position.x}
            cy={node.position.y}
            r={nodeRadius}
            fill={nodeColors[node.id] || '#2563eb'}
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={node.position.x}
            y={node.position.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {node.id}
          </text>
        </g>
      ))}
    </SvgStage>
  )
}
