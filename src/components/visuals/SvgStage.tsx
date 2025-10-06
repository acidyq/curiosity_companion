import { SVGAttributes } from 'react'

interface SvgStageProps extends SVGAttributes<SVGSVGElement> {
  width: number
  height: number
  children: React.ReactNode
}

export const SvgStage = ({ width, height, children, ...props }: SvgStageProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  )
}
