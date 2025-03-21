import { Node, Edge } from 'reactflow';

// Mapping exported node types to editor node types.
const typeMapping: Record<string, string> = {
  'text-input': 'input_text',
  // Add other mappings as needed.
};

export function importFlowFromJson(flowJson: any): { nodes: Node[], edges: Edge[] } {
  const nodes = flowJson.nodes.map((node: any) => {
    let data = node.content;

    // For ButtonsInputNode, convert "choices" into "buttons" array while preserving label info.
    if (node.type === 'input_buttons') {
      data = {
        prompt: node.content.prompt || '',
        buttons: Array.isArray(node.content.choices)
          ? node.content.choices.map((choice: any) => choice.label)
          : []
      };
    }

    const newType = typeMapping[node.type] || node.type;
    return {
      ...node,
      type: newType,
      data,
    };
  });

  // Generate edges if not provided.
  let edges = flowJson.edges;
  if (!edges || edges.length === 0) {
    edges = [];
    flowJson.nodes.forEach((node: any) => {
      // Handle option-based edges (e.g. for input_buttons or pic_choices)
      if (node.content && Array.isArray(node.content.choices)) {
        node.content.choices.forEach((choice: any) => {
          if (choice.next) {
            edges.push({ id: `${node.id}-${choice.next}`, source: node.id, target: choice.next });
          }
        });
      }
      // Handle general "next" property.
      if (node.next) {
        if (Array.isArray(node.next)) {
          node.next.forEach((targetId: string) => {
            edges.push({ id: `${node.id}-${targetId}`, source: node.id, target: targetId });
          });
        } else {
          edges.push({ id: `${node.id}-${node.next}`, source: node.id, target: node.next });
        }
      }
    });
  }
  return { nodes, edges };
}
