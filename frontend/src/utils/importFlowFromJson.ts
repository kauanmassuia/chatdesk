import { Node, Edge } from 'reactflow';

/**
 * Mapping exported node types to editor node types.
 * For example, if your export uses "text-input" but your editor uses "input_text".
 */
const typeMapping: Record<string, string> = {
  'text-input': 'input_text',
  // Add other mappings as needed.
};

/**
 * Converts an exported JSON flow into the internal format expected by the editor.
 * This function converts the "content" property into "data" and, for specific types,
 * transforms properties (e.g. "choices" to "buttons" for input_buttons).
 *
 * @param flowJson - The imported JSON flow.
 * @returns An object containing nodes and edges in the internal format.
 */
export function importFlowFromJson(flowJson: any): { nodes: Node[], edges: Edge[] } {
  const nodes = flowJson.nodes.map((node: any) => {
    // By default, set data to be the exported content.
    let data = node.content;

    // For ButtonsInputNode, convert "choices" into a "buttons" array.
    if (node.type === 'input_buttons') {
      data = {
        prompt: node.content.prompt || '',
        // Convert choices to buttons array: if choices is defined, map it to choice.label, otherwise default to empty array.
        buttons: Array.isArray(node.content.choices)
          ? node.content.choices.map((choice: any) => choice.label)
          : []
      };
    }

    // You can add additional type-specific conversions here if needed.

    // Convert the node type if there is a mapping.
    const newType = typeMapping[node.type] || node.type;
    return {
      ...node,
      type: newType,
      data,
    };
  });

  // If edges are provided in the imported JSON, use them; otherwise, return an empty array.
  const edges = flowJson.edges || [];
  return { nodes, edges };
}
