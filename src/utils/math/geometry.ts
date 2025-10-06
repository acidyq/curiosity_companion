export interface Point {
  x: number
  y: number
}

export interface Vector {
  x: number
  y: number
}

export const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

export const dotProduct = (v1: Vector, v2: Vector): number => {
  return v1.x * v2.x + v1.y * v2.y
}

export const normalize = (v: Vector): Vector => {
  const mag = Math.sqrt(v.x ** 2 + v.y ** 2)
  return mag > 0 ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 }
}

export const rotate = (p: Point, center: Point, angle: number): Point => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const dx = p.x - center.x
  const dy = p.y - center.y

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  }
}

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}
