// LinhaEditor.tsx
import { Edge } from 'reactflow'

export const estilizarLinhas = (edges: Edge[]) => {
    return edges.map((edge) => ({
      ...edge,
      style: { stroke: '#4a90e2', strokeWidth: 2 },
      type: 'smoothstep',
    }))
  }


