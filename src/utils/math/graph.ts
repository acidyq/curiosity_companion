export interface Graph {
  nodes: number[]
  edges: [number, number][]
}

export const createGraph = (nodeCount: number): Graph => {
  return {
    nodes: Array.from({ length: nodeCount }, (_, i) => i),
    edges: [],
  }
}

export const addEdge = (graph: Graph, from: number, to: number): Graph => {
  return {
    ...graph,
    edges: [...graph.edges, [from, to]],
  }
}

export const getNeighbors = (graph: Graph, node: number): number[] => {
  const neighbors = new Set<number>()

  graph.edges.forEach(([from, to]) => {
    if (from === node) neighbors.add(to)
    if (to === node) neighbors.add(from)
  })

  return Array.from(neighbors)
}

export const hasEdge = (graph: Graph, from: number, to: number): boolean => {
  return graph.edges.some(
    ([a, b]) => (a === from && b === to) || (a === to && b === from)
  )
}
