import { Node, Edge } from 'reactflow'
import { nodeExporters } from './nodeExporters'

export function exportFlowAsJson(nodes: Node[], edges: Edge[]) {
  const exportedMap: Record<string, any> = {}

  // 1) Process each node using its exporter.
  for (const node of nodes) {
    const exporter = node.type ? nodeExporters[node.type] : undefined
    const partial = exporter ? exporter(node) : { type: node.type, content: {} }
    exportedMap[node.id] = {
      id: node.id,
      type: partial.type,
      content: partial.content,
      next: null, // default
      position: node.position // <-- added position export here
    }
  }

  // 2) Process edges.
  for (const edge of edges) {
    const { source, sourceHandle, target } = edge
    const nodeEntry = exportedMap[source]
    if (!nodeEntry) continue

    if (nodeEntry.type === 'input_buttons') {
      // Expect the sourceHandle to be in the form "button-<index>"
      const match = sourceHandle?.match(/button-(\d+)/)
      if (match) {
        const index = parseInt(match[1], 10)
        if (nodeEntry.content?.choices && nodeEntry.content.choices[index]) {
          nodeEntry.content.choices[index].next = target
        }
      }
    } else if (nodeEntry.type === 'input_pic_choice') {
      // For PicChoice nodes, connect each choice's "next" pointer
      nodeEntry.content.choices.forEach((choice: any, index: number) => {
        const matchingEdge = edges.find(
          (edge) => edge.source === nodeEntry.id && edge.sourceHandle === `button-${index}`
        )
        if (matchingEdge) {
          choice.next = matchingEdge.target
        }
      })
    } else {
      // For non-button nodes, simply assign the target as the next pointer.
      nodeEntry.next = target
    }
  }

  // 3) Finalize and return the export.
  const finalNodes = Object.values(exportedMap)
  return {
    version: '1.0',
    id: 'exported_flow',
    name: 'VendFlow',
    nodes: finalNodes,
  }
}
