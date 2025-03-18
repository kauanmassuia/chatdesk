// exportFlowAsJson.ts
import { Node, Edge } from 'reactflow'
import { nodeExporters } from './nodeExporters'

export function exportFlowAsJson(nodes: Node[], edges: Edge[]) {
  // 1) Build a map: nodeId -> partial JSON
  const exportedMap: Record<string, any> = {}

  for (const node of nodes) {
    const exporter = node.type ? nodeExporters[node.type] : undefined;
    // If no exporter, fallback
    const partial = exporter
      ? exporter(node)
      : { type: node.type, content: {} }

    exportedMap[node.id] = {
      id: node.id,
      ...partial,
      // We'll fill in "next" below
      next: null,
    }
  }

  // 2) Use edges to define next pointers
  //    (If you have branching or multiple edges, adapt accordingly.)
  for (const edge of edges) {
    const sourceId = edge.source
    const targetId = edge.target

    // If the source node is valid, set "next" to targetId
    if (exportedMap[sourceId]) {
      exportedMap[sourceId].next = targetId
    }
  }

  // 3) Convert map to array
  const finalNodes = Object.values(exportedMap)

  // 4) Return final JSON
  return {
    version: '1.0',
    id: 'exported_flow',
    name: 'Exported Flow',
    nodes: finalNodes,
  }
}
