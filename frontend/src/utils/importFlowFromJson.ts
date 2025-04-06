import { Node, Edge } from 'reactflow';

export function importFlowFromJson(flowJson: any): { nodes: Node[], edges: Edge[] } {
  const nodes = flowJson.nodes.map((node: any) => {
    let data = node.content;

    // For ButtonsInputNode, convert "choices" into "buttons" array while preserving label info.
    if (node.type === 'input_buttons') {
      data = {
        prompt: node.content.prompt || '',
        buttons: Array.isArray(node.content.choices)
          ? node.content.choices.map((choice: any) => choice.label)
          : [],
        name: node.content.name || '',
      };
    }

    // Rehydrate input_text nodes: if value is missing, use the prompt as the value.
    if (node.type === 'input_text' && data) {
      if (data.value === undefined || data.value === null) {
        data.value = data.prompt || '';
      }
      // Preserve name
      data.name = node.content.name || '';
    }

    // Rehydrate wait input nodes: if value is missing, use waitTime (converted to string) as the value.
    if (node.type === 'input_wait' && data) {
      if (data.value === undefined || data.value === null) {
        data.value = data.waitTime !== undefined ? data.waitTime.toString() : '';
      }
      // Preserve name
      data.name = node.content.name || '';
    }

    // Handle picture choice nodes
    if (node.type === 'input_pic_choice' && data) {
      data.name = node.content.name || '';
    }

    // Handle payment nodes
    if (node.type === 'input_payment' && data) {
      data.name = node.content.name || '';
    }

    // Handle all other input nodes to ensure name is preserved
    if (node.type.startsWith('input_') && data && !data.name) {
      data.name = node.content.name || '';
    }

    const newType = node.type;
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
